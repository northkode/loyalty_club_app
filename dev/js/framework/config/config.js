/**
 * Created by kjeske_imac on 15-11-15.
 */
let config = {
	prod_server: "http://ec2-54-244-74-86.us-west-2.compute.amazonaws.com/",
	dev_server: "http://ec2-54-244-74-86.us-west-2.compute.amazonaws.com/",
    imageURL:"",
	title: 'TheRanch',
	oneSignalAPI:"adaf0509-07ea-4116-be60-679359c4dad5",
	GoogleGCM:"627172589929",
	stripe_dev:'pk_test_SfpkHUzwPEZIqFaOF7um96LB',
	stripe_prod:'pk_live_rNJ1TMrAvUtVPlcZzOcB7IfI',
	google_map_key:'AIzaSyBR74rERaa2_I1oL-bN79eP79d4lzLOxZw',
	ga: 'UA-86494014-1',
	/** list out images you want to preload here **/
	preloadImages: [

    ],
	mainAppClass: "TheRanch"
};

export {config}
