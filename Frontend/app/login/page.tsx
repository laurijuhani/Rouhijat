
const page = () => {
  return (
    <div>
      Create

      <form action='submit'>
        <label htmlFor='title'>Title</label>
        <input type='text' id='title' name='title' />

        <label htmlFor='content'>Content</label>
        <textarea id='content' name='content' />

        <button type='submit'>Create</button>


      </form>
    </div>
  )
}

export default page
