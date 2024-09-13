import os
import requests 

API_KEY = "dinhthai160@gmail.com_prYKAhgefR7hOtx2NAmmz3g6zjNwtYqxP8nvGQjxbvGxe4rZF9B1diA1Djzbf1DD"

BASE_URL = "https://api.pdf.co/v1"

SourceFile = "./NguyenDinhThaiCV.pdf"
Pages = ""
Password = ""
DestinationFile = ".\\result.html"
PlainHtml = False
ColumnLayout = False


def main(args = None):
    uploadedFileUrl = uploadFile(SourceFile)
    if (uploadedFileUrl != None):
        convertPdfToHtml(uploadedFileUrl, DestinationFile)


def convertPdfToHtml(uploadedFileUrl, destinationFile):
    """Converts PDF To Html using PDF.co Web API"""

    parameters = {}
    parameters["name"] = os.path.basename(destinationFile)
    parameters["password"] = Password
    parameters["pages"] = Pages
    parameters["simple"] = PlainHtml
    parameters["columns"] = ColumnLayout
    parameters["url"] = uploadedFileUrl

    url = "{}/pdf/convert/to/html".format(BASE_URL)

    response = requests.post(url, data=parameters, headers={ "x-api-key": API_KEY })
    if (response.status_code == 200):
        json = response.json()

        if json["error"] == False:
            #  Get URL of result file
            resultFileUrl = json["url"]            
            # Download result file
            r = requests.get(resultFileUrl, stream=True)
            if (r.status_code == 200):
                with open(destinationFile, 'wb') as file:
                    for chunk in r:
                        file.write(chunk)
                print(f"Result file saved as \"{destinationFile}\" file.")
            else:
                print(f"Request error: {response.status_code} {response.reason}")
        else:
            print(json["message"])
    else:
        print(f"Request error: {response.status_code} {response.reason}")


def uploadFile(fileName):
    """Uploads file to the cloud"""
    

    url = "{}/file/upload/get-presigned-url?contenttype=application/octet-stream&name={}".format(
        BASE_URL, os.path.basename(fileName))
    
    response = requests.get(url, headers={ "x-api-key": API_KEY })
    if (response.status_code == 200):
        json = response.json()
        
        if json["error"] == False:
            uploadUrl = json["presignedUrl"]
            uploadedFileUrl = json["url"]

            with open(fileName, 'rb') as file:
                requests.put(uploadUrl, data=file, headers={ "x-api-key": API_KEY, "content-type": "application/octet-stream" })

            return uploadedFileUrl
        else:
            print(json["message"])    
    else:
        print(f"Request error: {response.status_code} {response.reason}")

    return None


if __name__ == '__main__':
    main()