export default function Card() {
  return (
    <div>
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
            <img
                src="https://placeimg.com/400/225/arch"
                alt="Shoes"
            />
            </figure>
            <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>

            </div>
        </div>
    </div>
  );
}