import * as THREE from 'three'

const main=()=>{

    const canvas=document.querySelector("#canvas")
    const scene=new THREE.Scene()
    const camera=new THREE.Camera()
    const renderer=new THREE.WebGLRenderer({canvas})

    //Shape
    const circle=new THREE.CircleGeometry()

}

main()