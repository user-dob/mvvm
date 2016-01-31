'use strict'

let el = document.getElementById('app')

Tpl.addAttr('text', function(el, value) {
    el.textContent = value
})

Tpl.addAttr('for', function(el, items) {
    let frag = document.createDocumentFragment();

    for(let item of items) {
        let clone = document.importNode(el.content, true);

        Tpl.bindFrag(clone, item)

        frag.appendChild(clone)
    }

    el.parentNode.replaceChild(frag, el)
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

Tpl.addMethod('click', function(el, value, viewModel, expression) {
    el.addEventListener('click', function() {
        expression(value)
    })
})



let viewModel = {
    title: 'Title',
    click(name) {
        console.log(name)
    },
    user: {
        name: 'user 1',
        age: 26,
        foo: {
            bar: 'bar'
        },
        isShow: true,
        click(title) {
            this.name += '!'
        },
    },
    users: [
        {
            name: 'name 1',
            posts: {
                titles: [{title: 'text 1'}, {title: 'text 2'}, {title: 'text 3'}]
            }
        },
        {
            name: 'name 2',
            posts: {
                titles: [{title: 'text 5'}, {title: 'text 7'}, {title: 'text 9'}]
            }
        },
        {
            name: 'name 3',
            posts: {
                titles: [{title: 'text 12'}, {title: 'text 52'}, {title: 'text 36'}]
            }
        },
    ]
}

Tpl.bind(el, viewModel)


setTimeout(function() {
    viewModel.user.name = 'new Title'

    console.log(viewModel.user.name)
}, 1000)









