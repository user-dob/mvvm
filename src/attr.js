'use strict'

Tpl.addAttr('text', function(el, value) {
    el.textContent = value
})

Tpl.addEnumAttr('for', function(el, items, $this, $model) {
    let frag = document.createDocumentFragment(),
		child, children = [];

    for(let item of items) {
        let clone = document.importNode(el.content, true);

        child = Tpl.bindFrag(clone, item, $model)
		children.push(child)

        frag.appendChild(clone)
    }

    el.parentNode.replaceChild(frag, el)
	
	return children
	
}, function(el, changes, children) {

    changes.forEach(change => {

        console.log(change)

        if(change.type == 'splice') {
			
			let clone = document.importNode(el.content, true)
			let item = change.object[change.index];
			
			let child = Tpl.bindFrag(clone, item)
            let ref;

			if(change.index == change.object.length-1) {
                ref = children[children.length-1]
                ref = ref[ref.length-1]

                ref.parentNode.insertBefore(clone, ref.nextSibling);
								
			} else {
                ref = children[change.index][0]
                ref.parentNode.insertBefore(clone, ref)
			}

            children.splice(change.index, 0, child)

        }
    })
})

Tpl.addAttr('if', function(el, value, $this, $model) {
    if(value) {
        let frag = document.createDocumentFragment();
        let clone = document.importNode(el.content, true);

        Tpl.bindFrag(clone, $this, $model)

        frag.appendChild(clone)

        el.parentNode.replaceChild(frag, el)
    }
})

Tpl.addExpressionAttr('click', function(el, value, $this, $model, expression) {
    el.addEventListener('click', () => {
        expression(value)
    })
})
