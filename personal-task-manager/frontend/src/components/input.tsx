interface InputProps {
    label : string,
    placeHolder : string
    type? : string
}

function Input({label , placeHolder , type = 'text'} : InputProps ) {
    return (
        <div className="flex flex-col items-start gap-2
        p-4">
            <label className="font-medium">{label}</label>
            <input name="" type={type} placeholder={placeHolder}
            className={`border-1 border-gray-400 p-2 ${type === 'checkbox' ? "" : 'w-80'}`}
            />
        </div>
    )
}

export default Input