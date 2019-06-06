import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import settings from  '../clientAppSettings'

var counter = 2

  const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none'
    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
        <span className='close' onClick={handleClose}>&times;</span>
          {children}
        </section>
      </div>
    );
  };

export default class Products extends Component {

    constructor () {
        super()
        this.state = {
            productList: []
        }
    }

    componentDidMount() {
        axios.get(
            settings.apiUrlProducts ,
            { headers: { Authorization: settings.temporaryToken } }
        )
        .then(response => {
          this.setState({
            productList: response.data
          })
        })
        .catch(error => {
          console.log(error);
        })
      }
      

      showModal = (detailProduct) => {
          let urlImages = []

        detailProduct.images.map((image, index) => {
            return urlImages.push(image.url)
        })
          this.setState({
            show: true,
            sku :detailProduct.sku,
            name : detailProduct.name,
            images: urlImages,
            createdAt: detailProduct.created_at.substring(0, 10),
            price: detailProduct.price,
            stock: detailProduct.stock,
            brand: detailProduct.brand,
            condition: detailProduct.condition,
            dimensionsUnit: detailProduct.dimensions_unit,
            weight: detailProduct.weight,
            weightUnit: detailProduct.weight_unit,
            model: detailProduct.model,
            description: detailProduct.description_html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '')
          });
      }

      handleClose = () => { 
        this.setState({
            show: false
        })
     }

    hideModal = () => {
        this.setState({ show: false });
    }

    previousPage = () => {
        axios.get(`${settings.apiUrlProducts}?page=${counter--}`,
        { headers: { Authorization: settings.temporaryToken } }
        )
        .then(response => {
            this.setState({
                productList: response.data
            })
        })
        .catch(error => {
            console.log(error);
        })
      }
      
      nextPage = () => {
        axios.get(`${settings.apiUrlProducts}?page=${counter++}`,
        { headers: { Authorization: settings.temporaryToken } }
        )
        .then(response => {
            this.setState({
                productList: response.data
            })
        })
        .catch(error => {
            console.log(error);
        })
      }

    render() {
        const productList = this.state.productList
        const images = this.state.images
        const currentPage = this.state

        if (productList.length > 0) {
            return(
                <div>
                <table className="center">
                  <thead>
                     <tr>
                        <th>Identificador</th>
                        <th>Nombre</th>
                        <th>Imágen</th>
                        <th>Precio</th>
                        <th>Stock</th>
                     </tr>
                  </thead>
                  <tbody>
                  {productList.slice((currentPage * 20), 20).map((product, index) => {
                     return (
                     <tr key={index} onClick={() => this.showModal(product)}>
                       <td>{product.sku}</td>
                       <td>{product.name}</td>
                       <td><img src={product.images[0].url} alt="img" height='50' width='50'></img></td>
                       <td>{product.price}</td>
                       <td>{product.stock}</td>
                     </tr>
                     )
                  })}
                  </tbody>
                </table>
                {counter <= 0 ? <button disabled onClick={this.previousPage}>Anterior</button> : <button onClick={this.previousPage}>Anterior</button> }
                <button onClick={this.nextPage}>Siguiente</button>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                <h3 className='detail-Title'><strong>Detalles del Producto</strong></h3>
                <p><strong>Id:</strong> {this.state.sku}</p>
                <p><strong>Nombre:</strong> {this.state.name}</p>
                {images && images.map((urlImage, index) => {
                    return <img key={index} src={urlImage} alt="img" height='50' width='50'></img>
                  })}
                <p><strong>Fecha de Creacion:</strong> {this.state.createdAt}</p>
                <p><strong>Precio:</strong> {this.state.price}</p>
                <p><strong>Stock:</strong> {this.state.stock}</p>
                <p><strong>Marca:</strong> {this.state.brand}</p>
                <p><strong>Condicion:</strong>{this.state.condition}</p>
                <p><strong>Dimensiones por unidad:</strong> {this.state.dimensionsUnit}</p>
                <p><strong>Peso:</strong> {this.state.weight}</p>
                <p><strong>Peso por unidad:</strong> {this.state.weightUnit}</p>
                {this.state.model && <p><strong>Modelo:</strong> {this.state.model}</p>}
                {this.state.description && <p className='description'><strong>Descripción:</strong> {this.state.description}</p>}
                </Modal>
                </div>
              )
        } else {
            return (
                <h4>Cargando Productos ...</h4>
            )
        } 
      }
}