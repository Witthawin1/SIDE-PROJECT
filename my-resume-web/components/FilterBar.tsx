export default function FilterBar() {
  return (
    <div>   
        <div className="form-control w-full max-w-xs">
            <label className="label">
            <span className="label-text">Filter</span>
            </label>
            <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            />
        </div>
    </div>
  );
}