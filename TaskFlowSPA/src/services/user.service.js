async function createUser(userData) {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error("Failed to create user");
        }  
M    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
    
}

async function obtainUsers() {
    try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export { createUser, obtainUsers }
