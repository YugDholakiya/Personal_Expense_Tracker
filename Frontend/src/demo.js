const demo = async function () {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/expense/`, {
        method: "POST",
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify({

            "title": "clg fees",
            "price": "75000",
            "category": "education",
            "type": "expense",
            "date": "2025-11-28"
        })
    })
    console.log(res);

}
try {
    demo();
} catch (err) {
    console.log(err.message);
}