'use client'
import axios from "axios"
import { toast } from "react-toastify"
import { createContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react";

const AdminContext = createContext()

const AdminProvider = ({children}) => {
    const [proveedores, setProveedores] = useState(null)
    const [modal, setModal] = useState(false)
    const [imagen, setImagen] = useState(null)
    const [nombre, setNombre] = useState('')
    const [precio, setPrecio] = useState(0)
    const [costo, setCosto] = useState(0)
    const [descripcion, setDescripcion] = useState('')
    const [iva, setIva] = useState(0)
    const [categoriaId, setCategoriaId] = useState(0)
    const [proveedorId, setProveedorId] = useState(0)
    const [inventario, setInventario] = useState(0)
    const [alertModal, setAlertModal] = useState(false)
    const [tipo, setTipo] = useState('')
    const [elementoId, setElementoId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [urlImage, setUrlImage] = useState({})

    const [compras, setCompras] = useState([])

    // Ticket
    const [listaTicket, setListaTicket] = useState([])
    const [value, setValue] = useState(null)
    const [ticket, setTicket] = useState(null)

    const { data: session } = useSession()

    const obtenerProveedores = async () => {
        const { data } = await axios('http://localhost:3000/api/proveedores')
        setProveedores(data.proveedores)
    }

    const getProducto = async (tipo, elementoId) => {
        const { data } = await axios(`http://localhost:3000/api/${tipo}/${elementoId}`)
        setNombre(data.producto[0].nombre)
        setPrecio(data.producto[0].precio)
        setCosto(data.producto[0].costo)
        setIva(data.producto[0].iva)
        setUrlImage(data.producto[0].imagen)
        setDescripcion(data.producto[0].descripcion)
        setCategoriaId(data.producto[0].categoriaId)
        setProveedorId(data.producto[0].proveedorId)
        setInventario(data.producto[0].inventario)
    }

    const getCategoria = async (tipo, elementoId) => {
        const {data} = await axios(`http://localhost:3000/api/${tipo}/${elementoId}`)

        console.log(data)
    }

    const getCompras = async() => {
        const { data } = await axios('http://localhost:3000/api/compras');

        setCompras(data.compras);
    }


    useEffect(() => {
        obtenerProveedores();
    }, [])

    const handleChangeModal = async(tipo, elementoId) => {
        if(elementoId) {
            switch (tipo) {
                case 'productos':
                    try {
                        setElementoId(elementoId)
                        setTipo(tipo)
                        await getProducto(tipo, elementoId)
                        setModal(true)
                    } catch (err) {
                        console.log(err)
                    }
                    break;

                case 'categorias': 
                    try {
                        setElementoId(elementoId)
                        setTipo(tipo)
                        await getCategoria(tipo, elementoId)
                        setModal(true)
                    } catch (error) {
                        
                    }
                    
            }
            
            return
        } else {
            setTipo(tipo)
            setModal(!modal)
            return
        }
    }

    const handleChangeAlert = (e, tipo, elementoId) => {
        e.preventDefault()
        setAlertModal(!alertModal)
        setTipo(tipo)
        setElementoId(elementoId)
    }

    const uploadImage = async () => {
        const formData = new FormData()
        formData.append('file', imagen)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()

        return data.url
    }

    const handleSaveItem = async (e, elementoId) => {
        e.preventDefault()
        if(elementoId) {
            handleUpdateItem(tipo, elementoId)
            return
        } else {
            handleAddItem()
            return
        }
    }

    const handleAddItem = async () => {
        switch (tipo) {
            case 'productos':
                try {
                    setLoading(true)
                    const url = await uploadImage()
                    await axios.post('/api/productos', {nombre, precio, costo, url, descripcion, iva, categoriaId, proveedorId, inventario})

                    setNombre('')
                    setPrecio(0)
                    setCosto(0)
                    setIva(0)
                    setImagen(null)
                    setDescripcion('')
                    setCategoriaId(null)
                    setProveedorId(null)
                    setInventario(0)
                    setLoading(false)
                    toast.success("Producto Creado Correctamente")

                    setTimeout(() => {
                        setModal(false)
                    }, 500)
                } catch (error) {
                    
                }
                break;

            case 'categorias':
                try {
                    setLoading(true)
                    
                    const url = await uploadImage()

                    await axios.post('/api/categorias', {nombre, url})

                    setNombre('')
                    setImagen({})
                    setLoading(false)
                    toast.success("Categoria Agregada Correctamente")

                    setTimeout(() => {
                        setModal(false)
                    }, 500)
                } catch (err) {
                    console.log(err)
                }
                break;

            case 'proveedores':
                try {
                    setLoading(true)

                    await axios.post('/api/proveedores', {nombre})

                    setNombre('')
                    setLoading(false)
                    toast.success("Proveedor Agregado Correctamente")

                    setTimeout(() => {
                        setModal(false)
                    }, 500)
                } catch (err) {
                    console.log(err)
                }
                break;

            default:
                break;
        }
    }

    const handleUpdateItem = async (tipo, elementoId) => {
        switch (tipo) {
            case 'productos':
                try {
                    setLoading(true)
                    
                    if(imagen) {
                        const url = await uploadImage()
                        setUrlImage(url)
                    }

                    const info = await axios.put(`/api/productos/${elementoId}`, {nombre, precio, costo, urlImage, descripcion, iva, categoriaId, proveedorId, inventario})
                    console.log(info)

                    setNombre('')
                    setPrecio(0)
                    setCosto(0)
                    setIva(0)
                    setImagen(null)
                    setDescripcion('')
                    setCategoriaId(0)
                    setProveedorId(0)
                    setInventario(0)
                    setLoading(false)
                    toast.success("Producto Actualizado Correctamente")

                    setTimeout(() => {
                        setModal(false)
                    }, 500)

                } catch (err) {
                    console.log(err)
                }
                break;

            default:
                break;
        }
    }

    const handleDeleteItem = async (e) => {
        e.preventDefault()
        switch (tipo) {
            case 'productos':
                try {
                    console.log('hola')
                    await axios.delete('/api/productos', {
                        data: {
                            elementoId
                        }
                    })

                    setTipo('')
                    setElementoId(null)

                    toast.error("Producto Eliminada Correctamente")

                    setTimeout(() => {
                        setAlertModal(false)
                    }, 500)
                } catch (err) {
                    console.log(err)
                }
                break;
            
            case 'categorias':
                try {
                    await axios.delete('/api/categorias', {
                        data: {
                            elementoId
                        }
                    })

                    setTipo('')
                    setElementoId(null)

                    toast.error("Categoria Eliminada Correctamente")

                    setTimeout(() => {
                        setAlertModal(false)
                    }, 500)
                } catch (err) {
                    console.log(err)
                }
                break;
            
            case 'proveedores':
                console.log(id)
                break;

            default:
                console.log(tipo)
                break;
        }
    }

    const handleAddItemTicket = async() => {
        if(listaTicket.some(productoTicket => productoTicket.id === value.id)) {
            let listaTicketActualizada = listaTicket.map(productoTicket => productoTicket.id === value.id ? {
                id: productoTicket.id,
                nombre: productoTicket.nombre,
                precio: productoTicket.precio,
                cantidad: productoTicket.cantidad + 1
            } : productoTicket)
            
            setListaTicket(listaTicketActualizada)
        } else {
            const objetoProducto = {
                id: value.id,
                nombre: value.nombre,
                precio: value.precio,
                cantidad: 1
            }

            setListaTicket([...listaTicket, objetoProducto])
        }
    }

    const saveBuy = async(totalTicket, cantidadTicket) => {
        const buy = {
            listaTicket, 
            totalTicket, 
            cantidadTicket,
            usuarioID: await session?.user.id   
        }

        try {
            const res = await axios.post('/api/compras', {
                data: {
                    buy
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AdminContext.Provider
            value={{
                proveedores,
                handleChangeModal,
                modal,
                setImagen,
                nombre,
                setNombre,
                handleDeleteItem,
                alertModal,
                handleChangeAlert,
                tipo,
                elementoId,
                imagen,
                handleSaveItem,
                loading,
                setPrecio,
                precio,
                setCosto,
                costo,
                setDescripcion,
                descripcion,
                setIva,
                iva,
                setCategoriaId,
                categoriaId,
                setProveedorId,
                proveedorId,
                setInventario,
                inventario,
                handleAddItemTicket,
                listaTicket,
                setValue,
                elementoId,
                compras,
                saveBuy
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

export {
    AdminProvider
}

export default AdminContext