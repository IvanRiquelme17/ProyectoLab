const express = require('express')
const app = express()
const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = new Sequelize('labheisenberg', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

//MODELO PACIENTE
class paciente extends Model { }
paciente.init({
    dni: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    fechaNacimiento: { type: DataTypes.DATE },
    genero: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    telefono: { type: DataTypes.INTEGER },
    diagnostico: { type: DataTypes.STRING }
}, { sequelize, tableName: 'paciente', timestamps: false })

//MODELO BIOQUIMICO
class bioquimico extends Model { }
bioquimico.init({
    idBioquimico: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    titulo: { type: DataTypes.STRING }
}, { sequelize, tableName: 'bioquimico', timestamps: false })

/*const fer = bioquimico.build({ idBioquimico: '2', nombre: 'fernando', titulo: 'bioquimico' })
fer.save()*/  // DE ESTA MANERA PUEDO AGREGAR OBJ A LA BASE DE DATOS 

//MODELO RECEPCIONISTA
class recepcionista extends Model { }
recepcionista.init({
    idRecep: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    titulo: { type: DataTypes.STRING }
}, { sequelize, tableName: 'recepcionista', timestamps: false })

//MODELO TECNICO
class tecnico extends Model { }
tecnico.init({
    idTecnico: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    titulo: { type: DataTypes.STRING }
}, { sequelize, tableName: 'tecnico', timestamps: false })

//MODELO ORDEN DE TRABAJO
class ordenTrabajo extends Model { }
ordenTrabajo.init({
    numOrden: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaCreacion: { type: DataTypes.DATE },
    estado: { type: DataTypes.STRING },
    idPaciente: { type: DataTypes.INTEGER, allowNull: false, references: { model: paciente, key: 'dni' } }
}, { sequelize, tableName: 'ordenTrabajo', timestamps: false })

//MODELO MUESTRA
class muestra extends Model { }
muestra.init({
    tipoMuestra: { type: DataTypes.STRING },
    fechaResultado: { type: DataTypes.DATE },
    idMuestra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idOrden: { type: DataTypes.INTEGER, allowNull: false, references: { model: ordenTrabajo, key: 'numOrden' } },
    analisis: { type: DataTypes.STRING }
}, { sequelize, tableName: 'muestra', timestamps: false })

//MODELO ETIQUETA
class etiqueta extends Model { }
etiqueta.init({
    idEtiqueta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idMuestra: { type: DataTypes.INTEGER, allowNull: false, references: { model: muestra, key: 'idMuestra' } },
    nombrePaciente: { type: DataTypes.STRING, allowNull: false, references: { model: paciente, key: 'nombre' } },
    dniPaciente: { type: DataTypes.INTEGER, allowNull: false, references: { model: paciente, key: 'dni' } },
    nOrden: { type: DataTypes.INTEGER, allowNull: false, references: { model: ordenTrabajo, key: 'numOrden' } },
    fechaEtiquetado: { type: DataTypes.DATE }
}, { sequelize, tableName: 'etiqueta', timestamps: false })

//MODELO EXAMEN
class examen extends Model { }
examen.init({
    idExamen: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaExamen: { type: DataTypes.DATE },
    realizacionXLab: { type: DataTypes.STRING },
    observacion: { type: DataTypes.STRING },
}, { sequelize, tableName: 'examen', timestamps: false })

//MODELO DETERMINACION
class determinacion extends Model { }
determinacion.init({
    valorNumerico: { type: DataTypes.INTEGER },
    unidadMedidad: { type: DataTypes.INTEGER },
    idExamen: { type: DataTypes.INTEGER, allowNull: false, references: { model: examen, key: 'idExamen' } },
    valorReferencia: { type: DataTypes.INTEGER },
    tipoExamen: { type: DataTypes.STRING },
}, { sequelize, tableName: 'determinacion', timestamps: false })
app.listen(3000, () => {
    console.log(`La aplicación se ha abierto en el puerto 3000`)
})


sequelize.authenticate()
    .then(() => {
        console.log('Conectado')
    })
    .catch(err => {
        console.log('No se conecto')
    })