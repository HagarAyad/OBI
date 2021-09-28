import axios from 'axios'

const BASE_URL='http://apitest.obidigital.org'

const  apiClient=axios.create({
    baseURL:BASE_URL,
})

export const {get,post} = apiClient