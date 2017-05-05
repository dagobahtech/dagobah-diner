export default function(state=[], action) {
    if(action.type === "GET_MENU_ITEMS") {
        switch(action.category) {
            case "main":
                return [
                    {
                        id: 0,
                        name: "Main 1 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 1,
                        name: "Main 2 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 2,
                        name: "Main 3 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 3,
                        name: "Main 4 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 4,
                        name: "Main 1 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 5,
                        name: "Main 2 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 6,
                        name: "Main 3 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 7,
                        name: "Main 4 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 8,
                        name: "Main 1 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 9,
                        name: "Main 2 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 10,
                        name: "Main 3 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 11,
                        name: "Main 4 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    }
                ];
            case "side":
                return [
                    {
                        id: 20,
                        name: "Side 1 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 21,
                        name: "Side 2 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 22,
                        name: "Side 3 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 23,
                        name: "Side 4 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 24,
                        name: "Side 1 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 25,
                        name: "Side 2 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 26,
                        name: "Side 3 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 27,
                        name: "Side 4 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 28,
                        name: "Side 1 item",
                        type: "side",
                        description: "Side 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    }

                ];
            case "beverage":
                return [
                    {
                        id: 32,
                        name: "Beverage 1 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 33,
                        name: "Beverage 2 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 34,
                        name: "Beverage 3 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 35,
                        name: "Beverage 4 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 36,
                        name: "Beverage 1 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 37,
                        name: "Beverage 2 item",
                        type: "beverage",
                        description: "Beverage 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    }
                ];
            default:
                return [
                    {
                        id: 1,
                        name: "Main 1 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 1.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 2,
                        name: "Main 2 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 2.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 3,
                        name: "Main 3 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 3.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                    {
                        id: 4,
                        name: "Main 4 item",
                        type: "main",
                        description: "Main 1 item description",
                        price: 0.50,
                        quantity: 1,
                        image: "http://lorempixel/100/100"
                    },
                ];

        }
    }

    return state;

}