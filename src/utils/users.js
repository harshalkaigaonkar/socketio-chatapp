const users = [];
let rooms = new Map();

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

    //add Room
    if (rooms.has(user.room)) {
        let f = rooms.get(user.room);
        f++;
        rooms.set(user.room, f);
    } else {
        rooms.set(user.room, 1);
    }

    return { user };
}

//remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    let a;
    if (index !== -1) {
        a = users.splice(index, 1)[0];
        // a is an obk=ject in whuch there is h=room


        // .slice is a bit faster than filter as if it finds the match, it breaks the loop but for filter is still runs till it reaches end of the array
    }
    if (a !== undefined) {
        if (rooms.has(a.room)) {
            if (rooms.get(a.room) > 1) {
                let f = rooms.get(a.room);
                f--;
                rooms.set(a.room, f);
            } else {
                rooms.delete(a.room);
            }
        };
    }

    if (index !== -1) {
        return a;
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

const getAllActiveRooms = () => {
    return Array.from(rooms.keys());
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInChatRoom,
    getAllActiveRooms,
};