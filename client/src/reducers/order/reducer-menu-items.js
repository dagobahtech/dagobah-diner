const initialState = {
    main :[],
    side :[],
    beverage:[],
    current: "main"
}
export default function(state=initialState, action) {
    switch(action.type) {
        case "POPULATE_ITEM":{
            let newState = {...state}
            let main = [];
            let side = [];
            let beverage = [];
            action.payload.forEach(
                (item) => {
                    item.quantity =1;
                    switch(item.category){
                        case 1 : 
                            main.push(item);
                            break;
                        case 2 :
                            side.push(item);
                            break;
                        case 3 :
                            beverage.push(item);
                            break;
                        default: break;
                    }

                }
            )

            newState.main = main;
            newState.side = side;
            newState.beverage = beverage;                
            return newState;
        }
            

        case "GET_MENU_ITEMS":{
            let newState = {...state}
            newState.current= action.category;
            return newState;
            
        }

        default:
            return state;
            
    }

}