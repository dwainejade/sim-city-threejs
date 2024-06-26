import React from 'react';
import { useGLTF } from '@react-three/drei';
import { color } from 'three/examples/jsm/nodes/Nodes.js';

export const Apartment = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    return (
        <group {...props} dispose={null} >
            <mesh
                name="Apartment Building"
                castShadow
                geometry={nodes.House.geometry}
                material={materials['World ap']}
                scale={0.0015}
                rotation-x={Math.PI / 2}
                position-z={.2}
                position-y={.2}
            />
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#555'} />
            </mesh>
        </group>
    );
};
export const Apartment2 = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    return (
        <group {...props} dispose={null} >
            <mesh
                name="Apartment Building"
                castShadow
                geometry={nodes.House_2.geometry}
                material={materials['World ap']}
                scale={0.001}
                position-z={.2}
                position-y={.2}
            />
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#555'} />
            </mesh>
        </group>
    );
};
export const Apartment3 = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    return (
        <group {...props} dispose={null} >
            <mesh
                name="Apartment Building"
                castShadow
                geometry={nodes.House_3.geometry}
                material={materials['World ap']}
                scale={0.001}
                position-z={.2}
                position-y={.2}
            />
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#555'} />
            </mesh>
        </group>
    );
};

export const Shop = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    return (
        <group {...props} dispose={null} >
            <mesh
                name="Shop"
                castShadow
                geometry={nodes.Shop.geometry}
                material={materials['World ap']}
                scale={0.001}
                rotation-x={Math.PI / 2}
                rotation-z={-Math.PI / 2}
            />
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#555'} />
            </mesh>
        </group>
    );
};
export const Road = (props) => {
    return (
        <group {...props} dispose={null} >
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#2f2f2f'} />
            </mesh>
            {/* road lines */}
            <mesh receiveShadow >
                <boxGeometry args={[.02, .011, 1]} />
                <meshStandardMaterial color={'#fff'} />
            </mesh>
        </group>
    );
};
export const Road2 = (props) => { // 
    return (
        <group {...props} dispose={null} >
            <mesh receiveShadow>
                <boxGeometry args={[1, .01, 1]} />
                <meshStandardMaterial color={'#2f2f2f'} />
            </mesh>
        </group>
    );
};

export const Trees = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    return (
        <group {...props} dispose={null}>
            <mesh
                name="Trees"
                castShadow
                geometry={nodes.Firtree.geometry}
                material={materials['World ap']}
                scale={.003}
                position-y={-.04}
            />
        </group>
    );
};

export const Car = (props) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    // const CarTypes = ['CAR_03', 'CAR_03_1', 'CAR_03_1_2', 'CAR_03_2', 'CAR_03_2_2','CAR_03_2_3','CAR_03_3'];

    // Convert all node keys to lowercase and filter those that contain 'car'
    // Filter the keys that contain 'car' (case-insensitive) and preserve the original keys
    // Car types


    // Log the random car type

    return (
        <group {...props} dispose={null}>
            <mesh
                name="Car"
                castShadow
                geometry={nodes[props.carType]?.geometry}
                material={materials['World ap']}
                scale={.002}
            />
        </group>
    );
};

