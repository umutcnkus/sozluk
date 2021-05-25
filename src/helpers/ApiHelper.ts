import { basePath } from '../config'

export const getDefinition = (word: string) => {
    const requestUrl = basePath + "gts?ara=" + word;
    return fetch(requestUrl)
        .then(response => response.json())
}