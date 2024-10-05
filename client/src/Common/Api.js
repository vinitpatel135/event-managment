import axios from "axios"

class Api{
    constructor(){
        // this.baseUrl = "https://my-blog-project-zmww.onrender.com"
        this.baseUrl = "http://localhost:5050"
    }
    getToken(){
        return localStorage.getItem("token")
    }
    signup(data){
        return axios.post(`${this.baseUrl}/user/create`, data)
    }
    singin(data){
        return axios.post(`${this.baseUrl}/user/login`, data)
    }
    addEvent(data){
        const token = this.getToken()
        return axios.post(`${this.baseUrl}/event/add`, data, { headers: { token: token } })
    }
    listAllEvents(){
        return axios.get(`${this.baseUrl}/event/`)
    }
    listUserEvents(id){
        const token = this.getToken()
        return axios.get(`${this.baseUrl}/event/userevent/${id}`, { headers: { token: token } })
    }
    editEvent(id, data){
        const token = this.getToken()
        return axios.put(`${this.baseUrl}/event/edit/${id}`, data, { headers: { token: token } })
    }
    deleteEvent(id){
        const token = this.getToken()
        return axios.delete(`${this.baseUrl}/event/delete/${id}` , { headers: { token: token } })
    }
    bookEvent(data){
        const token = this.getToken()
        return axios.post(`${this.baseUrl}/book/add`, data , { headers: { token: token } })
    }
    cancleEvent(id){
        const token = this.getToken()
        return axios.delete(`${this.baseUrl}/book/${id}` , { headers: { token: token } })
    }
    userBookEvent(id){
        const token = this.getToken()
        return axios.get(`${this.baseUrl}/book/${id}` , { headers: { token: token } })
    }
}

const api = new Api()
export default api