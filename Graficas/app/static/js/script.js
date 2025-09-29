// Ventas totales por producto
fetch('/api/ventas_por_productos')
    .then(response => response.json())
    .then(data => {
        const productos = data.map(item => item.producto);
        const ventas = data.map(item => item.total);

        var optionsVentasPorProducto = {
            chart: {
                type: 'bar',
                height: 300,
                width: 450
        },
        series: [{
            name: 'Ventas',
            data: ventas
        }],
        xaxis: {
            categories: productos
        },
        tooltip: {
            y: {
            formatter: function (value) {
                return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            }
            }
        },
        title: {
            text: 'Top 6 productos más vendidos'
        },
        colors: ['#007b97ff']
    };

    var chart = new ApexCharts(document.querySelector("#ventasProducto"), optionsVentasPorProducto);
    chart.render();
    })
.catch(error => console.error('Error al obtener la información:', error));

// Porcentaje de métodos de pago
fetch('/api/metodos_pago')
    .then(response => response.json())
    .then(data => {
        const metodos = data.map(item => item.metodo_pago);
        const porcentajes = data.map(item => item.porcentaje);

        var optionsMetodosPago = {
            chart: {
                type: 'donut',
                height: 300,
        },
        series: porcentajes,
        labels: metodos,
        dataLabels: {   
            formatter: function (val) {
                return val.toFixed(1) + '%';
            }
        },
        legend: {
            position: 'bottom'
        },
        title: {
            text: 'Porcentaje de Métodos de Pago'
        },
        colors: ['#900101ff', '#0249bcff', '#009211ff']
    };

    var chart = new ApexCharts(document.querySelector("#metodosPago"), optionsMetodosPago);
    chart.render();
    })
.catch(error => console.error('Error al obtener la información:', error));

// Top clientes por ventas
fetch('/api/top_clientes')
    .then(response => response.json())
    .then(data => {
        const clientes = data.map(item => item.cliente);
        const totales = data.map(item => item.total);

        var optionsTopClientes = {
            chart: {
                type: 'bar',
                height: 300,
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        series: [{
            name: 'Total Ventas',
            data: totales
        }],
        xaxis: {
            categories: clientes
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }
        },
        title: {
            text: 'Top Clientes por Ventas'
        },
        colors: ['#4ddc00ff']
    };

    var chart = new ApexCharts(document.querySelector("#topClientes"), optionsTopClientes);
    chart.render();
    })
.catch(error => console.error('Error al obtener la información:', error));


// Top vendedores por ventas y productos
fetch('/api/top_vendedores')
    .then(response => response.json())
    .then(data => {
        const vendedores = data.map(item => item.vendedor);
        // Obtener todos los nombres de productos únicos vendidos por los top vendedores
        const productosSet = new Set();
        data.forEach(item => {
            item.productos.forEach(prod => {
                productosSet.add(prod.producto);
            });
        });
        const productosUnicos = Array.from(productosSet);

        // Para cada producto, crear una serie con las ventas por vendedor
        const series = productosUnicos.map(producto => {
            return {
                name: producto,
                data: data.map(vendedor => {
                    const prod = vendedor.productos.find(p => p.producto === producto);
                    return prod ? prod.total : 0;
                })
            };
        });

        var optionsTopVendedores = {
            chart: {
                type: 'bar',
                stacked: true,
                height: 300,
            },
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            series: series,
            xaxis: {
                categories: vendedores
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    }
                }
            },
            title: {
                text: 'Top Vendedores y Productos Vendidos'
            },
            colors: ['#4ddc00ff', '#007b97ff', '#900101ff', '#0249bcff', '#009211ff', '#4ddc00aa', '#ffb700', '#ff00b7', '#00b7ff', '#b700ff']
        };

        var chart = new ApexCharts(document.querySelector("#topVendedores"), optionsTopVendedores);
        chart.render();
    })
.catch(error => console.error('Error al obtener la información:', error));


// Mapa de México con ventas por estado usando ECharts
// Se asume que ECharts ya está importado en el <head>
fetch('/static/geo/mexico.geojson')
    .then(response => response.json())
    .then(geoJson => {
        // Modificar cada feature para que la propiedad 'name' sea igual a 'state_name'
        geoJson.features.forEach(f => {
            f.properties.name = f.properties.state_name;
        });
        echarts.registerMap('mexico', geoJson);

        fetch('/api/ventas_por_estado')
            .then(response => response.json())
            .then(data => {
                const ventasPorEstado = data.map(item => ({
                    name: item.estado,
                    value: item.total
                }));

                var chartDom = document.getElementById('ventasPorEstado');
                var myChart = echarts.init(chartDom);
                var option = {
                    title: {
                        text: 'Ventas por Estado',
                        left: 'center',
                        textStyle: { fontSize: 18 }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            let valor = params.value;
                            if (valor === undefined || valor === null || isNaN(valor)) valor = 0;
                            return `<b>${params.name}</b><br/>Ventas: ${valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`;
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: Math.max(...ventasPorEstado.map(e => e.value)),
                        left: 'left',
                        top: 'bottom',
                        text: ['Más ventas','Menos ventas'],
                        inRange: {
                            color: ['#e0f3f8', '#007818ff']
                        },
                        calculable: true
                    },
                    series: [{
                        name: 'Ventas',
                        type: 'map',
                        map: 'mexico',
                        roam: true,
                        emphasis: {
                            label: {
                                show: true,
                                fontWeight: 'bold',
                                fontSize: 14
                            }
                        },
                        data: ventasPorEstado
                    }]
                };
                myChart.setOption(option);
            })
            .catch(error => console.error('Error al obtener ventas por estado:', error));
    })
    .catch(error => console.error('Error al cargar el GeoJSON de México:', error));
