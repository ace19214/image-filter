import express from "express";
import bodyParser from "body-parser";
import {Request, Response} from "express";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get("/filteredimage", async (req, res) => {
    let imageUrl: string = req.query.image_url;

    if (!imageUrl) {
      return res.status(400).send("Image url is required!");
    }

    filterImageFromURL(imageUrl)
      .then((imageFile) =>
        res.status(200).sendFile(imageFile, () => {
          deleteLocalFiles([imageFile]);
          console.log("Local file deleted.");
        })
      )
      .catch((error) => {
        console.error("Error occurr at fileteredImage: " + error);
        res
          .status(500)
          .send(
            "Unexpected error occurr when filtering image! " + error.message
          );
      });
  });
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();