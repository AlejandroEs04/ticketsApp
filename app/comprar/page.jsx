'use client'
import { useEffect, useState } from "react"
import useFaster from "../../hooks/useFaster"
import ProductosCarrito from "../../components/ProductosCarrito"
import SeccionTotal from "../../components/SeccionTotal"
import DireccionContainer from '../../components/DireccionContainer'

const ComprarPage = () => {
    const [direccion, setDireccion] = useState({})
    const [total, setTotal] = useState(0)
    const [cant, setCant] = useState(0)
    const [envio, setEnvio] = useState(0)
    const { getCarrito, getDireccion, carrito } = useFaster()

    const getCarritoInfo = async() => {
        await getCarrito()
    }

    const getDireccionObject = async() => {
        const direccion = await getDireccion()
        setDireccion(direccion?.user)

        if(direccion?.user.ciudad === 'Apodaca' || direccion?.user.ciudad === 'General Escobedo' || direccion?.user.ciudad === 'Guadalupe' || direccion?.user.ciudad === 'San Nicolas de los Garza' || direccion?.user.ciudad === 'Monterrey' || direccion?.user.ciudad === 'San Pedro Garza Garcia' || direccion?.user.ciudad === 'Santa Catarina') {
            setEnvio(59)
        } else {
            setEnvio(99)
        }
    }

    useEffect(() => {
        getCarritoInfo()
        getDireccionObject()
    }, [])

    useEffect(() => {
        if(carrito.length >= 1) {
            const calculoTotal = carrito.reduce((total, productoCarrito) => total + productoCarrito.subtotal, 0)
            setTotal(calculoTotal)
    
            const calculoCant = carrito.reduce((cantidad, productoCarrito) => cantidad + productoCarrito.cantidadOProductos, 0)
            setCant(calculoCant)
        }
    },[carrito])

    return (
        <div className="contenedor">
            <div className='flex flex-col gap-10 md:gap-0 md:flex-row'>
                <div className="flex flex-col w-full md:w-4/6 gap-10">
                    <div className='flex flex-col w-full px-4'>
                        <h2 className="text-amber-500 font-extrabold text-5xl">Productos</h2>
                        <ProductosCarrito 
                            carrito={carrito}
                            compraSection={true}
                        />
                    </div>

                    <div className='flex flex-col w-full px-4'>
                        <h2 className="text-amber-500 font-extrabold text-5xl">Direccion</h2>
                        <DireccionContainer 
                            direccion={direccion}
                        />
                    </div>
                </div>

                <SeccionTotal
                    total={total}
                    cant={cant}
                    carrito={carrito}
                    btn={false}
                    envio={envio}
                />
            </div>
        </div>
    )
}

export default ComprarPage