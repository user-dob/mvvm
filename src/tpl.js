'use strict'

let _attr = {};
let _enumAttr = {};
let _expressions = {};

function map(path, call) {
	_map[path] = _map[path] || []
	_map[path].push(call)
}

function observer() {
	let body = []

	for(let i in _map) {
		let path = i
		let name = path.replace(/\./g, '_')
		path = `$this.${path}`.split('.');

		let prop = path.pop()
		path = path.join('.')

		body.push(
			`let _${name} = $this.${i}`,
			`Object.defineProperty(${path}, '${prop}', {`,
				`set(value) {`,
					`_${name} = value`,
					`_map['${i}'].forEach(f => { f.call($this, value) })`,
				`},`,
				`get() {`,
					`return _${name}`,
				`}`,
			`});`
		)
	}

	let f = new Function('$this', '_map', body.join('\n'))
	f($this, _map)
}

function expression(code) {
    eval(code)
}


class Tpl {

    static addAttr(name, callback) {
        _attr[`data-${name}`] = callback
    }

    static addEnumAttr(name, callback, change) {
        _enumAttr[`data-${name}`] = {callback: callback, change: change}
    }

    static addExpression(name, callback) {
        _expressions[`data-${name}`] = callback
    }

    static bindFrag(frag, viewModel) {
        let i = frag.children.length;

        while (i--) {
            Tpl.bind(frag.children[i], viewModel);
        }
    }

    static bind(dom, viewModel) {
        let nodesSnapshot,
            i, el, args,
            body = [];

        nodesSnapshot = document.evaluate('.//@*[starts-with(name(), "data-")]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        i = nodesSnapshot.snapshotLength;

        args = {
            names: [],
            values: []
        }

        body.push(
            'let $this = this',
            'let _map = {}',
            'for(let key in $this) {',
                'let value = $this[key]',
                'eval(`var ${key} = value`)',
            '}'
        )

        body.push(expression.toString())

        body.push(map.toString())

        while (i--) {
            el = nodesSnapshot.snapshotItem(i);
            let callAttr = _attr[el.nodeName]
            if(callAttr) {
                body.push(
                    `let f_${i}=${callAttr.toString()}`,
                    `let f_call_${i} = function(value) { f_${i}(el_${i}, value, $this, expression) }`,
                    `map("${el.nodeValue}", f_call_${i})`,
                    `f_call_${i}(${el.nodeValue})`
                )

                args.names.push(`el_${i}`)
                args.values.push(el.ownerElement)
            }

            let callExpression = _expressions[el.nodeName]
            if(callExpression) {
                body.push(
                    `let ex_${i}=${callExpression.toString()}`,
                    `ex_${i}(el_${i}, "${el.nodeValue}", $this, expression)`
                )

                args.names.push(`el_${i}`)
                args.values.push(el.ownerElement)
            }

            let callEnumAttr = _enumAttr[el.nodeName]
            if(callEnumAttr) {
                body.push(
                    `let en_${i}=${callEnumAttr.callback.toString()}`,
                    `let en_c_${i}=${callEnumAttr.change.toString()}`,
                    `en_${i}(el_${i}, ${el.nodeValue}, $this, expression)`,
                    `Array.observe(${el.nodeValue}, changes => { en_c_${i}(el_${i}, changes) })`
                )

                args.names.push(`el_${i}`)
                args.values.push(el.ownerElement)
            }
        }


        body.push(
            observer.toString(),
            'observer()'
        )

        let f = new Function('viewModel', 'values', 'body', [
            'let f = new Function("'+args.names.join('","')+'",body.join("\\n"))',
            //'try {',
                'f.apply(viewModel, values)',
            //'} catch(e) { console.log(e.message) }',
        ].join('\n'))

        f(viewModel, args.values, body)
    }




}