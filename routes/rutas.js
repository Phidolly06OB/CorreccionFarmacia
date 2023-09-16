const express = require('express');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const base = process.env.MONGO_URI;


const router = express.Router()
const mongo = require("mongodb").MongoClient;

const nombreBase = "farmaciaCampus"



router.get('/primer', async (req, res)=>{
    try {
        res.json("qloq")
    } catch (error) {
        console.log(error);
    }
})


//1. Obtener todos los medicamentos con menos de 50 unidades en stock.

router.get('/ejercicio1', async (req, res) =>{
    try {
        const client = new MongoClient(base,{useNewUrlParser:true,useUnifiedTopology:true})

        await client.connect()

        const db = client.db('test')
        
        const colection = db.collection('Medicamentos')

        const result = await colection.find({"stock":{'$lt':50}}).toArray()

        res.json({message:
            "conexion exitosa",
            result
        })

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//2. Listar los proveedores con su información de contacto en medicamentos.

router.get('/ejercicio2', async (req, res) =>{
    try {

        const client = new MongoClient(base, {useNewUrlParser:true,useUnifiedTopology:true})

        await client.connect()

        const db = client.db('test')

        const colection = db.collection('Medicamentos')

        const result = await colection.find().toArray()

        const proveedores = result.map((medicamento) => medicamento.proveedor)

        res.json(proveedores )

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//3. Medicamentos comprados al ‘Proveedor A’.

router.get('/ejercicio3', async (req, res) =>{
    try {

        const proveedor = "ProveedorA"

        const client = new MongoClient(base, {useNewUrlParser:true,useUnifiedTopology:true})

        await client.connect()

        const db = client.db('test')

        const colection = db.collection('Compras')

        const result = await colection.find({"proveedor.nombre": proveedor }).toArray()

        res.json(result)

        client.close()

        
        
    } catch (error) {
        console.log(error);
    }
})

//4. Obtener recetas médicas emitidas después del 1 de enero de 2023.


router.get('/ejercicio4', async (req, res) =>{
    try {

        const client = new MongoClient(base, {useNewUrlParser:true,useUnifiedTopology:true})

        await client.connect()

        const db = client.db('test')

        const colection = db.collection('Ventas')

        const result = await colection.find({"fechaVenta": {$gt: new Date("2023-01-29T00:00:00.000+00:00")}}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//5. Total de ventas del medicamento ‘Paracetamol’.


router.get("/ejercicio5", async (req, res) =>{
    try {

        const nombreM = "Paracetamol"
        
        const client = new MongoClient(base, {useNewUrlParser:true,useUnifiedTopology:true})

        await client.connect()

        const db = client.db('test')

        const colection = db.collection('Ventas')

        const result = await colection.find({"medicamentosVendidos.nombreMedicamento": nombreM}).toArray()

        const cantidad = result.length

        res.json({
            msg: `La cantidad vendidad fue de ${cantidad}`,
            result
        })

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//----------------------------- 6. Medicamentos que caducan antes del 1 de enero de 2024. ----------------------

router.get("/ejercicio6", async (req, res) =>{
    try {

        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos');
        
        const result = await colection.find({'fechaExpiracion': {$lt: new Date("2024-01-01T00:00:00.000+00:00")}}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//------------------- 7. Total de medicamentos vendidos por cada proveedor. -----------------------

router.get("/ejercicio7", async (req, res) =>{
    try {
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Compras');

        // const result = await colection.find().toArray()

        // const provedorA = await colection.find({"proveedor.nombre": "ProveedorA" }).toArray()
        // const provedorB = await colection.find({"proveedor.nombre": "ProveedorB" }).toArray()
        // const provedorC = await colection.find({"proveedor.nombre": "ProveedorC" }).toArray()

        // const cantidadPA = provedorA.length
        // const cantidadPB = provedorB.length
        // const cantidadPC = provedorC.length

        // res.json({ msg: `Cantidad vendida por el provedor A: ${cantidadPA}, Cantidad vendida por el provedor B: ${cantidadPB}, Cantidad vendida por el provedor C: ${cantidadPC}, `
        // })

        //mejor manera de hacer el codigo

        const proveedores = ["ProveedorA", "ProveedorB", "ProveedorC"]
        const result = {}

        for(const proveedor of proveedores){
            const medicamentosV = await colection.find({"proveedor.nombre": proveedor}).toArray()
            result[proveedor] = medicamentosV.length
        }

        res.json({
            msg: `Total de medicamentos vendidos por proveedor son: ${JSON.stringify(result)}`
        })

        client.close()

    } catch (error) {
        console.log(error);
    }
})


// ---------------------- 8. Cantidad total de dinero recaudado por las ventas de medicamentos. ----------------------

router.get("/ejercicio8", async (req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas');

        const result = await colection.find().toArray()

        const medicamentosV = result.map((vendidos) => vendidos.medicamentosVendidos)

        let totalRecaudado = 0;

        for (const venta of medicamentosV) {

            let subtotalVenta = 0;

            for (const medicamento of venta) {

                const { cantidadVendida, precio } = medicamento;
                subtotalVenta += cantidadVendida * precio;

            }
            
            totalRecaudado += subtotalVenta;

        }


        res.json({msg: `La cantidad de dinero recaudado fue de $${totalRecaudado}`})

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//---------------- 9. Medicamentos que no han sido vendidos. ----------------

router.get("/ejercicio9", async (req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')


        const result = await colection.aggregate([
            {
                $lookup:{
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "medicament"
                }
            },
            {
                $match: {
                    medicament: {$size: 0}
                }
            },
            {
                $project: {
                  _id: 0,
                  nombre: 1
                }
              }
        ]).toArray()

        if(result.length == 0){
            res.json({
                msg: "Todos los medicamentos han sido vendidos"
            })
        }else{
            res.json(result)
        }

        

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//10. Obtener el medicamento más caro.

router.get("/ejercicio10", async (req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos');

        const result = await colection.find().sort({"precio": -1}).limit(1).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//11.Número de medicamentos por proveedor.

router.get("/ejercicio11", async (req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos');

        const proveedores = ["ProveedorA", "ProveedorB", "ProveedorC"]
        const resultado = {}

        for(const proveedor of proveedores ){
            const medicamentos = await colection.find({"proveedor.nombre": proveedor}).toArray()
            resultado[proveedor] = medicamentos.length 
        }

        res.json({
        msg: `Cantidad de medicamentos por proveedor: ${JSON.stringify(resultado)}`
        });


        client.close()

    } catch (error) {
        console.log(error);
    }
})

//12. Pacientes que han comprado Paracetamol.

router.get("/ejercicio12", async (req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas');

        const result = await colection.find({"medicamentosVendidos.nombreMedicamento": "Paracetamol"}).project({"paciente": 1, "medicamentosVendidos": 1}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//13. R/= No hay datos para hacer este punto ya que todos los proveedores han vendido

//14. Obtener el total de medicamentos vendidos en marzo de 2023.

router.get("/ejercicio14", async(req, res) =>{
    try {
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')

        const fechaI = new Date("2023-03-01")
        const fechaF = new Date("2023-03-31")

        const result = await colection.find({"fechaVenta": {$gte: fechaI, $lt: fechaF}}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//15. Obtener el medicamento menos vendido en 2023.

router.get("/ejercicio15", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')

        const fechaI = new Date("2023-01-01")
        const fechaF = new Date("2024-01-01")

        const result = await colection.aggregate([
            {
                $match: {
                    fechaVenta: {
                        $gte: fechaI,
                        $lt: fechaF
                    }
                }
            },
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: "$medicamentosVendidos.nombreMedicamento", 
                    totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida" } 
                  }
            },
            {
                $sort: {
                    totalVendido: 1
                  }
            },
            {
                $limit: 1
            }
        ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//16. Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras).

router.get("/ejercicio16", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Compras')

        const result = await colection.aggregate([
            {
                $match: {
                    $and: [
                        { "fechaCompra": { $gte: new Date("2023-01-01T00:00:00.000Z") } },
                        { "fechaCompra": { $lte: new Date("2024-12-31T00:00:00.000Z") } }
                    ]
                }
            },
            {
                $unwind: "$medicamentosComprados"
            },
            {
                $group: {
                    _id: "$proveedor.nombre",
                    totalGanancia: {
                        $sum: { $multiply: [ "$medicamentosComprados.cantidadComprada","$medicamentosComprados.precioCompra"]
                        }
                    }
                }
            }
        ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})


//17 Promedio de medicamentos comprados por venta.

router.get("/ejercicio17", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')

        const result = await colection.aggregate([
            {
              $project: {
                _id: 1,
                cantidadMedicamentos: { $size: "$medicamentosVendidos" }
              }
            },
            {
              $group: {
                _id: null,
                totalMedicamentos: { $sum: "$cantidadMedicamentos" },
                totalVentas: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                promedioMedicamentosPorVenta: { $divide: ["$totalMedicamentos", "$totalVentas"] }
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//18. Cantidad de ventas realizadas por cada empleado en 2023.

router.get("/ejercicio18", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')

        const fechaI = new Date("2023-01-01")
        const fechaF = new Date("2024-01-01")

        const result = await colection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: fechaI,
                        $lt: fechaF
                    }
                }
            },
            {
                $group: {
                    _id: "$empleado.nombre",
                    ventas: { $sum: 1 }
                }
            },
            {
                $project: {
                    empleado: "$_id",
                    ventas: 1,
                    _id: 0
                }
            }
        ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//19. Obtener todos los medicamentos que expiren en 2024.

router.get("/ejercicio19", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')

        const fechaIE = new Date("2024-01-01")
        const fechaFE = new Date("2024-12-31")

        const result = await colection.find({"fechaExpiracion":{$gte: fechaIE, $lt: fechaFE }}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//20. Empleados que hayan hecho más de 5 ventas en total.

router.get("/ejercicio20", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')



        const result = await colection.aggregate([
            {
                $group: {
                    _id: "$empleado.nombre",
                    ventas: { $sum: 1 }
                }
            },
            {
                $match: {
                    totalVentas: { $gt: 5 }
                }
            },
            {
                $project: {
                    empleado: "$_id",
                    ventas: 1,
                    _id: 0
                }
            }
        ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//21. Medicamentos que no han sido vendidos nunca.

router.get("/ejercicio21", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')


        const result = await colection.aggregate([
            {
                $lookup:{
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "medicament"
                }
            },
            {
                $match: {
                    medicament: {$size: 0}
                }
            },
            {
                $project: {
                  _id: 0,
                  nombre: 1
                }
              }
        ]).toArray()

        if(result.length == 0){
            res.json({
                msg: "Todos los medicamentos han sido vendidos"
            })
        }else{
            res.json(result)
        }

        

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//22. Paciente que ha gastado más dinero en 2023.

router.get("/ejercicio22", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')

        const fechaI = new Date("2023-01-01")
        const fechaF = new Date("2024-01-01")

        const result = await colection.aggregate([
            {
                $match: {
                    "fechaVenta": {
                        $gte: fechaI,
                        $lt: fechaF
                    }
                }
            },
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: "$paciente.nombre",
                    totalGastado: {
                        $sum: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
                    }
                }
            },
            {
                $sort: { totalGastado: -1 }
            },
            {
                $limit: 1
            }
        ])
        .toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//23. Empleados que no han realizado ninguna venta en 2023.

router.get("/ejercicio23", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Empleados')


        const result = await colection.aggregate([
            {
                $lookup:{
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "empleado.nombre",
                    as: "ventas"
                }
            },
            {
                $match: {
                    "ventas.fechaVenta": {$not: {$gte: new Date("2023-01-01"), $lt: new Date("2024-01-01")}}
                }
            },
            {
                $project: {
                  _id: 0,
                  nombre: 1
                }
              }
        ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//24. Proveedor que ha suministrado más medicamentos en 2023.

router.get("/ejercicio24", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')


        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lt: new Date("2024-01-01")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: "$empleado.nombre",
                totalMedicamentosVendidos: {
                  $sum: "$medicamentosVendidos.cantidadVendida"
                }
              }
            },
            {
              $sort: {
                totalMedicamentosVendidos: -1
              }
            },
            {
              $limit: 1
            }
          ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//25. Pacientes que compraron el medicamento “Paracetamol” en 2023.

router.get("/ejercicio25", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.find({"fechaVenta": {$gte: new Date("2023-01-01"), $lt: new Date("2024-01-01")},"medicamentosVendidos.nombreMedicamento": "Paracetamol"}).project({"empleado": 1, "medicamentosVendidos": 1}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//26. Total de medicamentos vendidos por mes en 2023.

router.get("/ejercicio26", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2024-01-01")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: {
                  year: { $year: "$fechaVenta" },
                  month: { $month: "$fechaVenta" }
                },
                totalMedicamentosVendidos: {
                  $sum: "$medicamentosVendidos.cantidadVendida"
                }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//27.Empleados con menos de 5 ventas en 2023.

router.get("/ejercicio27", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lt: new Date("2024-01-01")
                }
              }
            },
            {
              $group: {
                _id: "$empleado.nombre",
                totalVentas: { $sum: 1 }
              }
            },
            {
              $match: {
                totalVentas: { $lt: 5 }
              }
            }
          ])
          .toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//28. Número total de proveedores que suministraron medicamentos en 2023.

router.get("/ejercicio28", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lt: new Date("2024-01-01")
                }
              }
            },
            {
              $group: {
                _id: "$empleado.nombre"
              }
            },
            {
              $group: {
                _id: null,
                totalProveedores: {
                  $sum: 1
                }
              }
            },
            {
                $project: {
                    _id: 0,
                    totalProveedores: 1
                }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//29. Proveedores de los medicamentos con menos de 50 unidades en stock.

router.get("/ejercicio29", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')

        const result = await colection.find({"stock": {$lt: 50}}).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
})

//30. Pacientes que no han comprado ningún medicamento en 2023

router.get("/ejercicio30", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Pacientes')
        const ventasC = db.collection('Ventas')


        const result = await colection.find({
            nombre:{
                $nin: await ventasC.distinct("paciente.nombre", {
                    fehcaVenta:{
                        $gte: new Date("2023-01-01"),
                        $lt: new Date("2024-01-01")
                    }
                })
            }
        }).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//31. Medicamentos que han sido vendidos cada mes del año 2023

router.get("/ejercicio31", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2024-01-01")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m", date: "$fechaVenta" }
                },
                medicamentosVendidos: {
                  $push: "$medicamentosVendidos.nombreMedicamento"
                }
              }
            },
            {
              $sort: {
                "_id": 1
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//32. Empleado que ha vendido la mayor cantidad de medicamentos distintos en 2023.

router.get("/ejercicio32", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2023-12-31")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: {
                  empleado: "$empleado.nombre",
                  medicamento: "$medicamentosVendidos.nombreMedicamento"
                }
              }
            },
            {
              $group: {
                _id: "$_id.empleado",
                totalMedicamentosDistintos: { $sum: 1 }
              }
            },
            {
              $sort: {
                totalMedicamentosDistintos: -1
              }
            },
            {
              $limit: 1
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})


//33. Total gastado por cada paciente en 2023.

router.get("/ejercicio33", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2024-01-01")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: {
                  paciente: "$paciente.nombre"
                },
                totalGastado: {
                  $sum: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
                }
              }
            },
            {
              $sort: {
                totalGastado: -1
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//34. Medicamentos que no han sido vendidos en 2023.

router.get("/ejercicio34", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')


        const result = await colection.aggregate([
            {
                $lookup:{
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "medicament"
                }
            },
            {
                $match: {
                    medicament: {$size: 0}
                },
                
            },
            {
                $project: {
                  nombre: 1,
                  fecha: { $literal: "2023" }
                }
              }
        ]).toArray()

        if(result.length == 0){
            res.json({
                msg: "Todos los medicamentos han sido vendidos"
            })
        }else{
            res.json(result)
        }

        

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//35. Proveedores que han suministrado al menos 5 medicamentos diferentes en 2023.

router.get("/ejercicio35", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2024-01-01")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: {
                  proveedor: "$medicamentosVendidos.nombreMedicamento",
                  empleado: "$empleado.nombre"
                }
              }
            },
            {
              $group: {
                _id: "$_id.empleado",
                totalMedicamentos: { $sum: 1 }
              }
            },
            {
              $match: {
                totalMedicamentos: { $gte: 5 }
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})

//36. Total de medicamentos vendidos en el primer trimestre de 2023.

router.get("/ejercicio36", async(req, res) =>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Ventas')
        
        const result = await colection.aggregate([
            {
              $match: {
                fechaVenta: {
                  $gte: new Date("2023-01-01"),
                  $lte: new Date("2023-03-31")
                }
              }
            },
            {
              $unwind: "$medicamentosVendidos"
            },
            {
              $group: {
                _id: null,
                totalMedicamentos: { $sum: "$medicamentosVendidos.cantidadVendida" }
              }
            },
            {
              $project: {
                _id: 0,
                totalMedicamentos: 1
              }
            }
          ]).toArray()

        res.json(result)

        client.close()

    } catch (error) {
        console.log();
    }
})


//37. Empleados que no realizaron ventas en abril de 2023.

router.get("/ejercicio37", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Empleados')


        const result = await colection.aggregate([
            {
                $lookup:{
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "empleado.nombre",
                    as: "ventas"
                }
            },
            {
                $match: {
                    "ventas.fechaVenta": {$not: {$gte: new Date("2023-014-01"), $lt: new Date("2023-04-31")}}
                }
            },
            {
                $project: {
                  _id: 0,
                  nombre: 1
                }
              }
        ]).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});

//38. Medicamentos con un precio mayor a 50 y un stock menor a 100.


router.get("/ejercicio38", async(req, res)=>{
    try {
        
        const client = new MongoClient(base, {useNewUrlParser:true, useUnifiedTopology:true})
        await client.connect()
        const db = client.db('test')
        const colection = db.collection('Medicamentos')


        const result = await colection.find({"precio": {$gte: 50}, "stock": {$lt: 100}}).toArray()


        res.json(result)

        client.close()

    } catch (error) {
        console.log(error);
    }
});


module.exports = router