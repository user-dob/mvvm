'use strict'

let _attr = {};
let _enumAttr = {};
let _expressionAttr = {};

const types = new Map([
    ['attr', _attr],
    ['enum', _enumAttr],
    ['expression', _expressionAttr]
])

function map(path, call) {
	_map[path] = _map[path] || []
	_map[path].push(call)
}

function observer() {
	let body = []

	for(let i in _map) {

        if(i.startsWith('$model')) continue;

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

    static addAttr(name, init, change) {
        _attr[`data-${name}`] = {init: init, change: change || init}
    }

    static addEnumAttr(name, init, change) {
        _enumAttr[`data-${name}`] = {init: init, change: change || init}
    }

    static addExpressionAttr(name, init, change) {
        _expressionAttr[`data-${name}`] = {init: init, change: change || init}
    }

    static bindFrag(frag, $this, $scope) {
        let i = frag.children.length,
			child, children = [];
			
		for(let i=0, length=frag.children.length; i<length; i++) {
			child = frag.children[i]
            Tpl.bind(child, $this, $scope)
			children.push(child)
		} 	 
		
		return children;
    }

    static bind(dom, viewModel, $scope) {
        let nodesSnapshot,
            i, el, args,
            body = [];

        nodesSnapshot = document.evaluate('.//@*[starts-with(name(), "data-")]', dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        i = nodesSnapshot.snapshotLength;

        if($scope === undefined) {
            $scope = new Scope(viewModel)
        }

        args = {
            names: ['$scope'],
            values: [$scope]
        }

        body.push(
            'let $this = this',
            'let _map = {}',
            '$this.$model = $scope.$model',
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
                    `let f_${i}=${callAttr.init.toString()}`,
                    `let f_call_${i} = function(value) { f_${i}(el_${i}, value, $this, $scope, expression) }`,
                    `map("${el.nodeValue}", f_call_${i})`,
                    `f_call_${i}(${el.nodeValue})`
                )

                args.names.push(`el_${i}`)
                args.values.push(el.ownerElement)
            }

            let callExpression = _expressionAttr[el.nodeName]
            if(callExpression) {
                body.push(
                    `let ex_${i}=${callExpression.init.toString()}`,
                    `ex_${i}(el_${i}, "${el.nodeValue}", $this, $scope, expression)`
                )

                args.names.push(`el_${i}`)
                args.values.push(el.ownerElement)
            }

            let callEnumAttr = _enumAttr[el.nodeName]
            if(callEnumAttr) {
                body.push(
                    `let en_${i}=${callEnumAttr.init.toString()}`,
                    `let en_c_${i}=${callEnumAttr.change.toString()}`,
                    `let c_${i} = en_${i}(el_${i}, ${el.nodeValue}, $this, $scope, expression)`,
                    `Array.observe(${el.nodeValue}, changes => { en_c_${i}(el_${i}, changes, c_${i}) })`
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
            'let f = new Function("'+args.names.join('","')+'", body)',
            //'try {',
                'f.apply(viewModel, values)',
            //'} catch(e) { console.log(e.message) }',
        ].join('\n'))

        f(viewModel, args.values, body.join('\n'))
    }




}