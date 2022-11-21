import { GetServerSideProps, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  image: string[];
};

type Props = {
  product: Product;
};

//This is client side code
function ProductPage({ product }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <header className="p-5 bg-green-400">
        <nav className="flex space-x-10">
          <p>Home</p>
          <p>Contact</p>
          <p>Link</p>
        </nav>
      </header>
      <h1>{product?.title}</h1>
      <h2>{product?.description}</h2>
      <p>${product?.price}</p>
    </div>
  );
}

export default ProductPage;

//getStaticPaths is required for dynamic SSG pages
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("http://dummyjson.com/products/");
  const data = await res.json();
  const products: Product[] = data.products;

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));
  console.log(paths);
  return {
    paths,
    fallback: true,
  };
};

//Below is server side code, cannot use useState, useEffect
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  //![Important] query is frontend naming, params is backend naming
  const id = context?.params?.id;
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const data: Product = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: data,
    },
    revalidate: 10,
  };
};
