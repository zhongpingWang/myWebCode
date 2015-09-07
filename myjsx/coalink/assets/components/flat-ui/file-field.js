import React from "react/addons"


let FileField = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        sizeLimit: React.PropTypes.number
    },
    getValue() {
        return this.state.attach;
    },
    getInitialState () {
        return {
            label: undefined
        }
    },
    getDefaultProps() {
        return {
            label: "上传文件",
            height: 40,
            sizeLimit: 10,

        }
    },
    getStyles() {
        return {
            root: {
                position: 'relative',
                width: "100%",
                height: 32,
            },
            label: {
                display: "inline-block",
                float: "left",
                width: "100%",
                height: 32,
                lineHeight: "32px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: this.state.uploadProgress ? "#FFF" : "#337ab7",
                backgroundImage: "linear-gradient(to right, blue " + this.state.uploadProgress + "%, white " + this.state.uploadProgress + "%)",
                backgroundRepeat: "repeat-x",
                filter: 'e(%("progid:DXImageTransform.Microsoft.gradient(startColorstr=\'%d\', endColorstr=\'%d\', GradientType=1)",argb(@start-color),argb(@end-color)))'
            },
            input: {
                marginTop: "-32px",
                float: "left",
                width: "100%",
                height: 32,
                opacity: 0,
                cursor: 'pointer'
            },
            abort: {
                position: 'absolute',
                right: 6,
                top: 6,
                color: "red",
                cursor: "pointer",
                width: 20,
                height: 20,
                lineHeight: "20px",
                fontSize: "16px",
                textAlign: "center",
            }
        }
    },
    handleChange(e) {
        let file = e.target.files[0];
        let self = this,
            xhr = new XMLHttpRequest(),
            formData = new FormData();
        self.setState({
            xhr: xhr,
            formData: formData
        });
        formData.append('file', file);
        xhr.onloadend = (e)=>{
            let resp = JSON.parse(xhr.responseText);
            if (resp.success) {
                self.handleUploadSuccess(xhr, resp.data);
            } else {
                self.handleUploadError(xhr, e)
            }

        }
        xhr.onerror = (e)=>{
            self.handleUploadError(xhr, e);
        }
        xhr.onabort = (e)=>{
            self.handleUploadAbort(xhr, e);
        }
        xhr.upload.onprogress = (e) =>{
            self.handleUploadProgress(xhr, e);
        }
        xhr.open("POST", "/api/storage/upload", true);
        xhr.send(formData);
    },
    handleUploadSuccess(xhr, attach) {
        this.setState({
            uploadStatus: 'success',
            uploadProgress: 0,
            attach: attach,
            label: attach.name
        });
        (this.props.onUploaded || ()=>{})(self, attach);
    },
    handleUploadProgress(xhr, e){
        this.setState({
            uploadStatus: 'progress',
            uploadProgress: (e.loaded / e.total) * 100,
            label: "上传中 " + ((e.loaded / e.total) * 100).toFixed(0) + "%"
        });
        (this.props.onProgress || ()=>{})(self, ((e.loaded / e.total) * 100).toFixed(0));
    },
    handleUploadError(xhr, e) {
        this.setState({
            uploadStatus: 'error',
            uploadProgress: 0,
            label: '上传失败'
        });
        (this.props.onError || ()=>{})(self);
    },
    handleUploadAbort(xhr, e) {
        this.setState({
            uploadStatus: 'abort',
            uploadProgress: 0,
            label: '重新上传'
        });
        (this.props.onAbort || ()=>{})(self);
    },
    abort() {
        this.state.xhr.abort();
    },
    render () {
        let styles = this.getStyles();
        let {
            onUploaded,
            onProgress,
            onError,
            onAbort,
            onChange,
            ...other
        } = this.props;
        return (
            <div style={styles.root}>
                <a style={styles.label}>{(this.state.label || this.props.label)}</a>
                <input {...other} type='file' style={styles.input} onChange={this.handleChange}/>
                {
                    this.state.uploadProgress
                    ? <span onClick={this.abort} style={styles.abort}>x</span>
                    : undefined
                }
            </div>
        )
    }
});

export default FileField;
