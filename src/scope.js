
class Scope {

    constructor($model) {
        this.$model = $model
        this.evetns = {}
    }

    $on(name, evetn) {
        this.evetns[name] = this.evetns[name] || []
        this.evetns[name].push(evetn)
    }

    $emit(name, ...args) {
        let evetns = this.evetns[name]
        if(evetns)
            evetns.forEach(evetn => {
                evetn.apply(this.$model, args)
            })

    }


}

