
import React, { ChangeEvent, useState } from 'react'
import '../index.scss'

interface ImageType {
    url: string
    tag: string
}


const Image: React.FC = () => {
    const responseImage = (valueTag: string) => {
        try {
            setOffBtn(true)
            fetch(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${valueTag}`)
                .then((res) => res.json())
                .then((res) => setImage((state: any) => state.concat({ url: res.data.image_url, tag: valueTag })))
            setTimeout(() => {
                setOffBtn(false)
            }, 5000);
        } catch (error) {
            window.alert('Произошла http ошибка')
        }

    }
    const [valueTag, setValueTag] = useState<{ text: string }>({ text: '' })
    const [image, setImage] = useState([])
    const [grouped, setGrouped] = useState<boolean>(false)
    const [offBtn, setOffBtn] = useState<boolean>(false)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValueTag({ text: e.target.value })
    }
    const getImage = () => {
        const pattern = /^[a-zA-Z0-9]+$/
        if (valueTag.text === '') {
            window.alert('поле должно быть заполненно')
        } else if (!pattern.test(valueTag.text)) {
            return window.alert('Только латиница!')
        } else { setTimeout(() => { responseImage(valueTag.text) }, 5000) }

    }
    const clearImageTeg = () => {
        setValueTag({ text: '' })
        setImage([])
    }
    const groupUngroup = () => {
        setGrouped(grouped ? false : true)
    }
    console.log(image)
    const setTagImage = new Set(image.map((i: { tag: string }) => i.tag))
    const groupImage = Array.from(setTagImage)
    return (<div className='header'>
        <div className='heading'> <input name='tag' type="text" onChange={handleChange} value={valueTag.text} placeholder='Введите название' /> <button onClick={getImage} disabled={offBtn}>{offBtn ? 'Загрузка...' : 'Загрузить'} </button><button onClick={clearImageTeg}>Очистить</button><button onClick={groupUngroup} > {grouped ? 'Разгруппировать' : 'Группировать'} </button> </div> <div className='groupImage' id='img' > {grouped ? (<div  > {groupImage.map((t) => (
            <div>
                <h2>{t}</h2>
                {image.filter((i: { tag: string }) => i.tag === t).map((images: ImageType, i) => (
                    <img src={images.url} alt={images.tag} key={i} />
                ))}
            </div>
        ))} </div>) : (<div>
            {image.map((images: ImageType, i) => (
                <img key={i} src={images.url} alt={images.tag} />
            ))}
        </div>)}
        </div>
    </div>)
}
export default Image