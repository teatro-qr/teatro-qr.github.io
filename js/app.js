
Vue.component("reproductor", {
    template: ` 
            <div class="row">
                <h5 style="text-align: center; margin: 30px;">Nombre Del Audio</h5>
                <audio class="reproductor" style=" width: 100%;" src="/audios/prueba/bensound-summer.mp3" controls="controls"
                    type="audio/mpeg" autoplay="autoplay" preload="preload">
            </div>
    `
});

var app = new Vue({
    el: '#app',
    data: {
        camaraPrendida: false,
        spinnerActivo: false
    },
    methods: {
        grabar: function () {
            var componente = this;
            componente.camaraPrendida = true;
            componente.spinnerActivo = true;
            const codeReader = new ZXing.BrowserQRCodeReader();

            codeReader
                .listVideoInputDevices()
                .then(videoInputDevices => {
                    if (videoInputDevices.length > 0) {
                        var idDispositivoSeleccionado = videoInputDevices.length > 1 ? videoInputDevices[1].deviceId : videoInputDevices[0].deviceId;
                        componente.spinnerActivo = false;
                        codeReader
                            .decodeOnceFromVideoDevice(idDispositivoSeleccionado, 'video')
                            .then(result => {
                                window.location.href = result.text;
                            })
                            .catch(() => {
                                M.toast({ html: 'Error al escanear, por favor probá nuevamente' });
                            });
                    } else {
                        M.toast({ html: 'No se encontró ninguna cámara disponible' });
                    }
                })
                .catch(() => {
                    M.toast({ html: 'Error al iniciar escaneo, por favor probá nuevamente' });
                });
        }
    }
});