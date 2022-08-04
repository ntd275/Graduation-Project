exports.uploadImage = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).json({
                success: false,
                message: "You must upload a file"
            })
        }
        let imagePath = req.file.path
        return res.status(200).json({
            success: true,
            result: imagePath
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

exports.uploadVideo = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).json({
                success: false,
                message: "You must upload a file"
            })
        }
        let videoPath = req.file.path
        return res.status(200).json({
            success: true,
            result: videoPath
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}