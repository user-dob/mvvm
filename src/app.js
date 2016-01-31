'use strict'

let el = document.getElementById('app')

let viewModel = {
    title: 'Title',
    click(name) {
        viewModel.users.push(
            {
                name: 'name 1',
                posts: {
                    titles: [{title: 'text 1'}, {title: 'text 2'}, {title: 'text 3'}]
                }
            }
        )
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









