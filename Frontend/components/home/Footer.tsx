import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-8">
    <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div>
            <Image
                src="/logo_alt.svg"
                alt="logo"
                width={100}
                height={100}
              />
            </div>

            <div>
                <p className="font-semibold text-gray-800 dark:text-white">Quote</p>

                <div className="flex flex-col items-start mt-5 space-y-2">
                    <p className="text-gray-600 transition-colors duration-300 dark:text-gray-300 italic">&quot;Täällä ei mestispullot juhli&quot;</p>
                    <p className="text-gray-600 transition-colors duration-300 dark:text-gray-300 italic">— Joku viisas joskus</p>
                </div>
            </div>

            <div>
                <p className="font-semibold text-gray-800 dark:text-white">Sosiaalinen media</p>

                <div className="mb-6 flex items-center mt-6">
                  <a
                    href="https://github.com/laurijuhani"
                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary transition-colors duration-300 hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                      <path fill="white" d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=VZrDxD0Za9I&ab_channel=AbsoluteFool"
                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary transition-colors duration-300 hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                  >
                    <svg
                      width="16"
                      height="12"
                      viewBox="0 0 16 12"
                      className="fill-current"
                    >
                      <path d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/santapaperiosastonrouhijat/#"
                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary transition-colors duration-300 hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 50 50">
                      <path fill="white" d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                    </svg>  
                  </a>
                </div>
            </div>

            <div>
                <p className="font-semibold text-gray-800 dark:text-white">Yhteystiedot</p>

                <div className="flex flex-col items-start mt-5 space-y-2">
                    <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">santapaperiosasto@rouhijat.fi</a>
                </div>
            </div>
        </div>
        
        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />
        
        <div className="flex flex-col items-center justify-end sm:flex-row">
          <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300">© 2025 Lauri Wilppu. All Rights Reserved.</p>
        </div>
    </div>
  </footer>
  )
}

export default Footer
