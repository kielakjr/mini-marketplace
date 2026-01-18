import React from 'react'
import { Form } from 'react-router-dom';
import Tile from '../components/ui/Tile';
import LabeledInput from '../components/ui/LabeledInput';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useSelector } from 'react-redux';
import { addNewProduct } from '../api/products';
import { useActionData, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const categories = useSelector((state) => state.products.categories);
  const data = useActionData();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (data?.success) {
      alert('Product added successfully!');
      navigate('/products');
    } else if (data?.error) {
      alert(`Error: ${data.error}`);
    }
  }, [data]);

  return (
    <Tile className="w-1/2 mx-auto mt-8 p-6">
      <Form method="post" className="flex flex-col gap-4 items-center justify-center">
        <LabeledInput>
          <label htmlFor="title" className="block mb-2">Title</label>
          <Input type="text" id="title" name="title" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="description" className="block mb-2">Description</label>
          <Input textarea id="description" name="description" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="price" className="block mb-2">Price</label>
          <Input type="number" id="price" name="price" step="0.01" required />
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="images" className="block mb-2">Image URLs (comma separated)</label>
          <Input type="text" id="images" name="images" defaultValue="https://fastly.picsum.photos/id/357/200/300.jpg?hmac=rK03ZiTfDr2EKKfNNjF58dSVmtnPicb3anbbvMkGm1M"/>
        </LabeledInput>
        <LabeledInput>
          <label htmlFor="categoryId" className="block mb-2">Category</label>
          <select id="categoryId" name="categoryId" required className="border border-white/20 bg-white/30 text-white px-3 py-1.5 rounded-md w-96 outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-[0_4px_15px_rgb(0,0,0,0.1)] transition-all duration-200">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </LabeledInput>
        <Button
          type="submit"
        >
          Add Product
        </Button>
      </Form>
    </Tile>
  )
}

export default AddProduct

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const price = parseFloat(formData.get('price'));
  const imagesRaw = formData.get('images');
  const categoryId = formData.get('categoryId');
  const images = imagesRaw

  const productData = {
    title,
    description,
    price,
    images,
    categoryId,
  }

  try {
    await addNewProduct(productData);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
