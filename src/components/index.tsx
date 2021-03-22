
import React, { ChangeEvent, useState } from 'react'
import '../index.scss'

interface ImageType {
    url: string
    tag: string
}

const makeValue = (length: number) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sendRequest = (value: string, setImage: React.Dispatch<React.SetStateAction<never[]>>, setOffBtn: React.Dispatch<React.SetStateAction<boolean>>) => {
    setOffBtn(true)
    setTimeout(() => {
        setOffBtn(false)
    }, 5000);
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${value}`)
        .then((res) => res.json())
        .then((res) => setImage((state: any) => {
            if (res.data.image_url) {
                return state.concat({ url: res.data.image_url, tag: value })
            } else {
                window.alert('По тегу ничего не найдено. Имя тега: ' + value)
                return state
            }
        }))


}
const Image: React.FC = () => {
    const responseImage = (valueTag: string) => {
        if (valueTag === 'delay') {
            const idInterval: number = window.setInterval(() => {
                const makeText = makeValue(Math.random() * 10)
                try {
                    sendRequest(makeText, setImage, setOffBtn)
                } catch (error) {
                    window.alert('Произошла http ошибка')
                }
            }, 5000);

            setIdInterval(idInterval)
        } else {
            const valueText: string[] = valueTag.includes(',') ? valueTag.split(',') : [valueTag]
            try {
                valueText.map((valueInput) => sendRequest(valueInput, setImage, setOffBtn));
            } catch (error) {
                window.alert('Произошла http ошибка')
            }
        }
    }


    const [valueTag, setValueTag] = useState<{ text: string }>({ text: '' })
    const [image, setImage] = useState([])
    const [grouped, setGrouped] = useState<boolean>(false)
    const [offBtn, setOffBtn] = useState<boolean>(false)
    const [idInterval, setIdInterval] = useState<number>()
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValueTag({ text: e.target.value })
    }
    const getImage = () => {
        const pattern = /^[a-zA-Z0-9,]+$/
        if (valueTag.text === '') {
            window.alert('поле должно быть заполненно')
        } else if (!pattern.test(valueTag.text)) {
            return window.alert('Только латиница!')
        } else {
            responseImage(valueTag.text)
        }

    }
    const clearImageTeg = () => {
        setValueTag({ text: '' })
        setImage([])
        clearInterval(idInterval)
    }
    const groupUngroup = () => {
        setGrouped(grouped ? false : true)
    }

    const getTagImage = (image: string) => {
        setValueTag({ text: image })
    }

    const setTagImage = new Set(image.map((i: { tag: string }) => i.tag))
    const groupImage = Array.from(setTagImage)
    return (<div className='header'>
        <div className='heading'>
            <input name='tag' type="text" onChange={handleChange} value={valueTag.text} placeholder='Введите название' />
            <button onClick={getImage} disabled={offBtn}>{offBtn ? 'Загрузка...' : 'Загрузить'} </button>
            <button onClick={clearImageTeg}>Очистить</button>
            <button onClick={groupUngroup} > {grouped ? 'Разгруппировать' : 'Группировать'} </button> </div>
        <div className='groupImage'> {grouped ? (<div  > {groupImage.map((t) => (
            <div>
                <h2>{t}</h2>
                {image.filter((i: { tag: string }) => i.tag === t).map((images: ImageType, i) => (
                    <img src={images.url} alt={images.tag} key={i} onClick={() => getTagImage(images.tag)} />
                ))}
            </div>
        ))} </div>) : (<div>
            {image.map((images: ImageType, i) => (
                <img key={i} src={images.url} alt={images.tag} onClick={() => getTagImage(images.tag)} />
            ))}
        </div>)}
        </div>
    </div>)
}
export default Image