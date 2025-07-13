
function TaskCard() {
    return (
        <div className="flex place-content-between m-2">
            <div className="flex flex-col items-start">
                <h3 className="font-medium text-xl">Prepare presentation slides</h3>
                <span>Due : 2024-03-15</span>
                <span>Project Alpha</span>
            </div>
            <input type="checkbox" />
        </div>
        )     
}

export default TaskCard