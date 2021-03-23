const users = [];

// add User
const addUser = ({ id, username, room }) => {
    // clean Data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    //check for existing User
    const existingUser = users.find((user) => user.room === room && user.username === username);

    if (existingUser) {
        return {
            error: "User Already Exists !!"
        }
    }

    //Store User
    const user = { id, username, room };
    users.push(user);
    return { user };
}

//remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
        // .slice is a bit faster than filter as if it finds the match, it breaks the loop but for filter is still runs till it reaches end of the array
    }

}


//get User
const getUser = (id) => {
    return users.find((user) => user.id === id);
}

//getUsersInChatRoom
const getUsersInChatRoom = (room) => {
    return users.filter((user) => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInChatRoom
};