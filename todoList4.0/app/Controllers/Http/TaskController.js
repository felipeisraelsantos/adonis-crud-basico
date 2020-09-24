'use strict'

const Tarefa = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {
    async index({ view }){
        
        const tasks = await Tarefa.all()

        return view.render('tasks',{
            title: 'Latest tasks',
            tasks: tasks.toJSON()
        })
    }

    async store({ request, response, session }){

        const message = {
            'title.required': 'Campo requerido',
            'title.min': 'minimo 3 caracteres'
        }

        const validation = await validateAll(request.all(),{
            title: 'required|min:5|max:140',
            body: 'required|min:10'
        }, message)

        if (validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const task = new Tarefa()

        task.title = request.input('title')
        task.body = request.input('body')

        await task.save()
        session.flash({ notification: 'Task added !' })

        return response.redirect('/tasks')
    }

    async detail({ params, view }){
        const task = await Tarefa.find(params.id)

        return view.render('detail',{
            task:task
        })
    }

    async remove ({ params, response, session }){
        const task = await Tarefa.find(params.id)

        await task.delete()

        session.flash({ notification: 'task removed !' })

        return response.redirect('/tasks')
    }

}

module.exports = TaskController
