import { Router, Request, Response } from 'express';
import Server from '../class/server';
import { Socket } from 'socket.io';
import { usersConnects } from '../sockets/sockets';


const router = Router();


router.get('/message', (req: Request, res: Response) => {
    res.json({
        ok: true

    })
});

router.post('/message', (req: Request, res: Response) => {

    let cuerpo = req.body.cuerpo;
    let de = req.body.de;

    const payload = req.body;

    const server = Server.instance;

    server.io.emit('new-message', payload);

    res.json({
        ok: true,
        cuerpo,
        de
    })
});

router.post('/message/:id', (req: Request, res: Response) => {

    let cuerpo = req.body.cuerpo;
    let de = req.body.de;
    let id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit('private-message', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })
});

// servicio para octener todos los id
router.get('/users', (req: Request, res: Response) => {


    const server = Server.instance;

    server.io.clients((err: any, clients: string[]) => {

        if(err) {
           return res.json({
                ok: false,
                err
            }) 
        }

        for (let i = 0; i < clients.length; i++) {
            
        }

        res.json({
            ok: true,
            clients
        })
    });
});

router.get('/users/detals', (req: Request, res: Response) => { 

    res.json({
        ok: true,
        clients: usersConnects.getList()
    })
    

});


export default router;