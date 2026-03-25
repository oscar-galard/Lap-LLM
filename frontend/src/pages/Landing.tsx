import { Link } from 'react-router-dom'

function Landing() {
    return (
	<>
	<h1 className="text-3xl font-bold underline">Hola Bitch</h1>

            <Link to="/hardware">
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    View Hardware Specs
                </button>
            </Link>
	    <p>Sera que esta es una landing page?</p>
	</>
    )
}

export default Landing
