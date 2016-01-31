'use strict'

Tpl.addAttr('text', function(el, value) {
    el.textContent = value
})

Tpl.addEnumAttr('for', function(el, items) {
    let frag = document.createDocumentFragment();

    for(let item of items) {
        let clone = document.importNode(el.content, true);

        Tpl.bindFrag(clone, item)

        frag.appendChild(clone)
    }

    el.parentNode.replaceChild(frag, el)
}, function(el, changes) {

    changes.forEach(change => {
        if(change.type == 'splice') {

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
