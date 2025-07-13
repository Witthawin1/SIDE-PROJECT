import Header from "../components/header"
import Input from "../components/input"

function addTaskPage() {
    return (
        <>
            <Header></Header>
            <div className="p-6 flex flex-col">
                <h1 className="font-bold text-3xl">Add New Task</h1>
                <Input label="Task Title" placeHolder="Enter task title"></Input>
                <div className="flex flex-col items-start ml-4">
                    <label htmlFor="" className="font-bold">Description</label>
                    <textarea placeholder="Enter task description"
                    className="border-gray-400 border-1 p-2 mt-2 w-80 min-h-30">
                    </textarea>
                </div>
                <Input label="Due Date" placeHolder="Select due date" type="date"></Input>
                <Input label="Status" placeHolder="Enter task title" type="checkbox"></Input>
            <div className="flex flex-row self-end gap-4">
                <button className='rounded-md bg-gray-300 p-3 font-medium'>Cancel</button>
                <button className='rounded-md bg-black text-white p-3 font-medium'>Add Task</button>
            </div>
            </div>
        </>
    )
}

export default addTaskPage