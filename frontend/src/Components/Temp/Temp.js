const Temp = () => {
    const getData = async (e) => {
        e.preventDefault();
        try {
            console.log("fetching");
            const response = await fetch("https://game-on-9bhv.onrender.com/api/players/load");
            console.log("fetch complete");
            if (!response.ok) throw new Error("Failed to fetch players");
            console.log("fetch okay");
            const fetchJson = await response.json();
            if(fetchJson.message !== "woo! done!") throw new Error("json was wrong");
        } catch (err) {
            console.error("Error fetching players:", err);
        }
    }
    return (
        <div className="bg-black text-white">
            TESTTESTTESTTEST
            <button onClick={getData} type="button" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                    click me to import players
                </button>
        </div>
    );
}

export default Temp;