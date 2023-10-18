const express = require('express')
const sequelize = require('sequelize')
const app = express()

//conexión a la base de datos
const s = new sequelize('labheisenberg', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

//definir modelos
//PACIENTE
const paciente = s.define('paciente', {
    "dni": { type: sequelize.INTEGER, primaryKey: true },
    "nombre": sequelize.STRING,
    "apellido": sequelize.STRING,
    "fechaNacimiento": sequelize.DATE,
    "genero": sequelize.STRING,
    "direccion": sequelize.STRING,
    "email": sequelize.STRING,
    "telefono": sequelize.INTEGER,
    "diagnostico": sequelize.STRING,
}, { tableName: 'paciente' }) //especifico el nombre de la tabla porque me tomaba cualquier otro nombre

//BIOQUIMICO
const bioquimico = s.define('bioquimico', {
    "idBioquimico": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "nombre": sequelize.STRING,
    "titulo": sequelize.STRING
}, { tableName: 'bioquimico' })

//RECEPCIONISTA
const recepcionista = s.define('recepcionista', {
    "idRecep": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "nombre": sequelize.STRING,
    "titulo": sequelize.STRING
}, { tableName: 'recepcionista' })

//TECNICO
const tecnico = s.define('tecnico', {
    "idTecnico": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "nombre": sequelize.STRING,
    "titulo": sequelize.STRING
}, { tableName: 'tecnico' })

//EXAMEN
const examen = s.define('examen', {
    "idExamen": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "fechaExamen": sequelize.DATE,
    "realizacionXLab": sequelize.STRING,
    "observacion": sequelize.STRING,
    "determinacion": sequelize.INTEGER
}, { tableName: 'examen' })

//ORDEN DE TRABAJO
const ordenTrabajo = s.define('ordentrabajo', {
    "numOrden": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "fechaCreacion": sequelize.DATE,
    "estado": sequelize.STRING,
    'idPaciente': {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: paciente,
            key: 'dni'
        }
    },
    "muestraFaltante": sequelize.STRING,
    "idBioquimico": {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: bioquimico,
            key: 'idBioquimico'
        }
    },
    "idTecnico": {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: tecnico,
            key: 'idTecnico'
        }
    },
    "examenes": {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: examen,
            key: 'idExamen'
        }
    },
    "idRecepcionista": {
        type: sequelize.INTEGER,
        allowNull: false,
        reference: {
            model: recepcionista,
            key: 'idRecep'
        }
    }
}, { tableName: 'ordentrabajo' })

//DETERMINACION
const determinacion = s.define("determinacion", {
    "valorNumerico": sequelize.INTEGER,
    "unidadMedidad": sequelize.STRING,
    "valorReferencia": sequelize.STRING,
    "tipoExamen": sequelize.STRING,
    "idExamen": {
        type: sequelize.INTEGER,
        allowNull: false,
        reference: {
            model: examen,
            key: 'idExamen'
        }
    }
}, { tableName: 'determinacion' })

//MUESTRA
const muestra = s.define("muestra", {
    "idMuestra": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "tipoMuestra": sequelize.STRING,
    "fechaResultado": sequelize.DATE,
    "analisis": sequelize.STRING,
    "idOrden": {
        type: sequelize.INTEGER,
        allowNull: false,
        reference: {
            model: ordenTrabajo,
            key: 'numOrden'
        }
    }
}, { tableName: 'muestra' })

//ETIQUETA
const etiqueta = s.define("etiqueta", {
    "idEtiqueta": { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    "fechaEtiquetado": sequelize.DATE,
    "idMuestra": {
        type: sequelize.INTEGER,
        allowNull: false,
        reference: {
            model: muestra,
            key: "idMuestra"
        }
    }
}, { tableName: 'etiqueta' })
app.get('/buscar/:documento', (req, res) => {
    const documento = req.params.documento
    paciente.findAll({
        attributes: ['dni', 'nombre', 'fechaNacimiento', 'genero', 'direccion', 'email', 'telefono', 'diagnostico'],
        where: { dni: documento }
    }).then(resultados => { res.json(resultados) })
        .catch(error => {
            console.error(error + ' Error en la busqueda del paciente')
        })
})
app.get('/buscarApellido/:apellido', (req, res) => {
    const apellido = req.params.apellido
    paciente.findAll({
        attributes: ['dni', 'nombre', 'fechaNacimiento', 'genero', 'direccion', 'email', 'telefono', 'diagnostico'],
        where: { apellido: apellido }
    }).then(resultados => { res.json(resultados) })
        .catch(error => {
            console.error(error + ' Error en la busqueda del paciente')
        })
})
app.get('/buscarNombre/:nombre', (req, res) => {
    const nombre = req.params.nombre
    paciente.findAll({
        attributes: ['dni', 'nombre', 'apellido', 'fechaNacimiento', 'genero', 'direccion', 'email', 'telefono', 'diagnostico'],
        where: { nombre: nombre }
    }).then(resultados => { res.json(resultados) })
        .catch(error => {
            console.error(error + ' Error en la busqueda del paciente')
        })
})

app.get('/', (req, res) => {
    const formulario = `
    <form action='/buscar' method="POST">
        <h2>Filtrar paciente por:</h2>
        <select name="select" id="filtrado">
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="dni">Dni</option>
        </select>
        <input type="text" id="x" name="valor">
        <button type="submit" id="busqueda">Buscar</button>
        <h2>Resultados:</h2>
        <div id="resultados"></div>
    </form>`
    res.setHeader('Content-Type','text/html')
    res.send(formulario)
})

app.post('/buscar', (req, res) => {
    const select = req.body.select
    const valor = req.body.valor

    if (select === 'nombre') {
        paciente.findAll({
            attributes: ['dni', 'nombre', 'apellido', 'fechaNacimiento', 'genero', 'direccion', 'email', 'telefono', 'diagnostico'],
            where: { nombre: valor }
        }).then(resultados => {
            const resultadosHTML = `<table><tr><th>DNI</th><th>Nombre</th>...</tr>`
            resultados.forEach(resultado => {
                resultadosHTML += `<tr><td>${resultado.dni}</td><td>${resultado.nombre}</td><td>${resultado.apellido}</td><td>${resultado.fechaNacimiento}</td><td>${resultado.genero}</td><td>${resultado.direccion}</td></tr>`
            })
            resultadosHTML += `</table>`
            res.send(resultadosHTML)
        })  
            .catch(error => {
                console.error(error)
                res.status(500).json({ error: 'Error en la búsqueda del paciente' })
            })
    } 
})

//autenticacion de los modelos
s.authenticate()
    .then(() => {
        console.log('Conexion a la base de datos exitosa')
    })
    .catch(error => {
        console.log('No se pudo conectar a la base de datos')
    })
app.listen(3000, () => {
    console.log('Servidor andando')
}) 