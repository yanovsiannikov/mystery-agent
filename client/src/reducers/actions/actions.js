import { ADD_COORDINATE, DEL_TASK_FROM_REDUCER, ADD_TASK_TO_USER_REDUCER} from './actionTypes'
import {LOGOUT_USER, LOGIN_USER} from './actionTypes'

export const addCoordinateAC = (coordinates, title, description, adressId, mapCenter) => ({
    type: ADD_COORDINATE,
    payload: {
        id: adressId,
        coordinates: coordinates,
        title: title,
        description: description,
        mapCenter: mapCenter ? mapCenter : coordinates,
    }
})

//Удаляет задание из стора с тасками
export const delTaskFromReducerAC = (id) => ({
    id: id,
    type: DEL_TASK_FROM_REDUCER,
})
//Добавляет задание в стор юзера
export const addTaskToUserReducerAC = (task) =>({
    task : task,
    type : ADD_TASK_TO_USER_REDUCER
})
//достаёт API ключ из файла
async function getAPIKey() {
    let res = await fetch('/key');
    let APIKey = res.text()
    return APIKey;
}
//получаем координаты из яндекса по API Яндекса по аддресу
export const fetchCoordinatesAC = (adress, title, description, expDate) => {
    return async (dispatch) => {
        const APIkey = await getAPIKey();
        let res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${APIkey}&format=json&geocode=Москва ${adress}`)
        let data = await res.json();
        let coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        coordinates = coordinates.split(' ')
        let long = Number(coordinates[0]);
        let lat = Number(coordinates[1])
        let arrayWithCoordinates = [lat, long];

        res = await fetch('/tasks/savetask', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ arrayWithCoordinates, title, description, expDate }),
        });
        data = await res.json();
        dispatch(addCoordinateAC(arrayWithCoordinates, title, description , data.id));
    }
}


//Логика *взять задание
export const takeTaskAC = (id, task) => {
    return async (dispatch) => {
        //удалить из редьюсера тасков
        await dispatch(delTaskFromReducerAC(id))
        //добавить в редьюсер пользователя
        await dispatch(addTaskToUserReducerAC(task))
    }
}

//Авторизация
export const userLogin = (user, tasks) => ({type : LOGIN_USER, user : user, tasks : tasks});
export const userLogout = () => ({type : LOGOUT_USER});