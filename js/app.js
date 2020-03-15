
Vue.component("reproductor", {
    data: function () {
        return {
            audioSrc: "",
            nombreAudio: ""
        }
    },
    created: function () {
        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);

        this.audioSrc = params.get("audio");
        const audio = this.audioSrc;
        this.nombreAudio = audio.split("/")[1].replace('-',' ');


    },
    template: ` 
            <div class="row" v-show="audioSrc">
                <h5 style="text-align: center;margin: 30px;text-transform: capitalize;">{{nombreAudio}}</h5>
                <audio class="reproductor" style=" width: 100%;" v-bind:src="'/audios/'+audioSrc+'.mp3'" controls="controls" controlsList="nodownload"
                    type="audio/mpeg" autoplay="autoplay" preload="preload">
            </div>
    `
});

Vue.component("scanner-qr", {
    data: function () {
        return {
            mostrarBotonCamara: true,
            camaraPrendida: false,
            spinnerActivo: false,
            IOS: false
        }
    },
    mounted: function () {
        var iDevices = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ];

        if (!!navigator.platform) {
            while (iDevices.length) {
                if (navigator.platform === iDevices.pop()) {
                    this.IOS = true;
                }
            }
        }

        var componente = this;
        $("#video").on("play", function () {
            setTimeout(function () {
                componente.camaraPrendida = true;
                componente.spinnerActivo = false;
            }, 300);
        });
    },
    methods: {
        grabar: function () {
            var componente = this;
            componente.mostrarBotonCamara = false;
            componente.spinnerActivo = true;
            if (componente.IOS) {
                M.toast({
                    html: 'Por el momento Teatro QR no es compatible con sistemas operativos IOS, podes escanear el código QR directamente desde la app de la cámara',
                    displayLength: 30000
                });
            }
            const codeReader = new ZXing.BrowserQRCodeReader();

            codeReader
                .listVideoInputDevices()
                .then(videoInputDevices => {
                    if (videoInputDevices.length > 0) {
                        var idDispositivoSeleccionado = videoInputDevices.length > 1 ? videoInputDevices[1].deviceId : videoInputDevices[0].deviceId;
                        setTimeout(function () {
                            if (!componente.camaraPrendida) {
                                componente.spinnerActivo = false;
                                componente.mostrarBotonCamara = true;
                                M.toast({ html: 'Revisá que el navegador tenga permiso para acceder a la cámara de tu teléfono' });
                            }
                        }, 3000);
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
                    M.toast({ html: 'La versión de tu dispositivo no es compatible con el escaner de QR' });
                });
        }
    },
    template: ` 
        <div>
            <div class="row">
                <div class="col s12 l8 offset-l2">
                    <div class="card-panel teal">
                        <span class="white-text">
                            ¡Bienvenido! Para escuchar uno de nuestros audios simplemente presioná
                            el botón y escanea el código QR.
                        </span>
                    </div>
                </div>
            </div>
            <div id="lausan-qr-escaner-web" class="row">
                <div class="col s4 offset-s4">
                    <div class="lausan-escaner-container">
                        <a v-on:click="grabar" v-show="mostrarBotonCamara"
                            class="waves-effect waves-light btn-large lausan-color-bordo">
                            <i class="material-icons left lausan-icono-camara">camera_alt</i>
                        </a>
                        <div v-show="spinnerActivo" class="preloader-wrapper big active">
                            <div class="spinner-layer spinner-red-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col s12 l8 offset-l2">
                    <video v-show="camaraPrendida" id="video" class="lausan-video">
                    </video>
                </div>

            </div>
        </div>
    `,
});

var app = new Vue({
    el: '#app'
});