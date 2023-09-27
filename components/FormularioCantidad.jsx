'use client'
import { useState } from "react"
import useFaster from "../hooks/useFaster"

const FormularioCantidad = ({ producto }) => {
    const [cantidad, setCantidad] = useState(1)

    const { handleAgregarCarrito } = useFaster()

    return (
        <div className="flex flex-col">
            <p>Cantidad</p>
            <div className="flex gap-5">
            <button 
                    type="button" 
                    onClick={() => {
                        if(cantidad <= 1) return 
                        setCantidad(cantidad-1)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                <p className="text-4xl border px-2 py-1 rounded-lg">{producto.inventario <= 0 ? 0 : cantidad}</p>

                <button 
                    type="button" 
                    onClick={() => {
                        if(cantidad >= producto.inventario) return 
                        setCantidad(cantidad+1)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            {producto.inventario <= 0 && ( <p className="text-2xl text-red-600 font-bold mt-10">Producto no disponible por el momento</p> )}

            <button 
                onClick={() => handleAgregarCarrito(producto, cantidad)}
                className={`${producto.inventario <= 0 ? 'bg-indigo-100 text-indigo-500' : 'bg-amber-500 text-white hover:bg-amber-600'} w-80 py-2 px-5 rounded-xl font-bold mt-10 md`}
                disabled={producto.inventario <= 0}
            >
                Agregar al carrito
            </button>
        </div>
    )
}

export default FormularioCantidad