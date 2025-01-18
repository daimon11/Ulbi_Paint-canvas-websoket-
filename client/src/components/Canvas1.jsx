import React, { useEffect, useRef, useState } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const Canvas1 = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true)
    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        const ctx = canvasRef.current.getContext('2d');
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                console.log('img', img)
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.stroke()
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const soсket = new WebSocket('ws://localhost:5000/');
            canvasState.setSocket(soсket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, soсket, params.id))
            soсket.onopen = () => {
                console.log('Подкчлючение есть')
                soсket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection',
                }))
            }
            soсket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                console.log('canvas msg', msg);
                switch (msg.method) {
                    case 'connection':
                        console.log(`пользователь ${msg.username} приединился`)
                        break
                    case 'draw':
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case 'finish':
                ctx.beginPath()


        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
            .then(response => console.log(response.data))
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className='canvas'>

            <Modal show={modal} onHide={'handleClose'}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input ref={usernameRef} type='text' />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas
                onMouseDown={() => mouseDownHandler()}
                ref={canvasRef}
                width={600}
                height={400}
            ></canvas>
        </div>
    )
})

export default Canvas1;