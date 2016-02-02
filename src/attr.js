'use strict'

Tpl.addAttr('text', function(el, value) {
    el.textContent = value
})

Tpl.addEnumAttr('for', function(el, items) {
    let frag = document.createDocumentFragment(),
		child, children = [];

    for(let item of items) {
        let clone = document.importNode(el.content, true);

        child = Tpl.bindFrag(clone, item)
		children.push(child)

        frag.appendChild(clone)
    }

    el.parentNode.replaceChild(frag, el)
	
	return children
	
}, function(el, changes, children) {

    changes.forEach(change => {
        if(change.type == 'splice') {
			
			children[0][0].appendChild(document.createElement('div'))

        }
    })

    console.log(el, changes)
})

Tpl.addAttr('if', function(el, value, viewModel) {
    if(value) {
        let frag = document.createDocumentFragment();
        let clone = document.importNode(el.content, true);

        Tpl.bindFrag(clone, viewModel)

        frag.appendChild(clone)

        el.parentNode.replaceChild(frag, el)
    }
})

Tpl.addExpression('click', function(el, value, viewModel, expression) {
    el.addEventListener('click', () => {
        expression(value)
    })
})
