"use client";

import { Toggle } from "@/components/tailgrids/core/toggle";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/tailgrids/core/table";

import { Button } from "@/components/tailgrids/core/button";

import { Trash1, Check, ClockThree, Plus } from "@tailgrids/icons";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { useEffect, useState } from "react";
import { Badge } from "@/components/tailgrids/core/badge";
import { Spinner } from "@/components/tailgrids/core/spinner";

import { fetchTodos } from "@/data/todos";
import { TodoType } from "@/data/todos";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop} from "@/components/tailgrids/core/overlay";
import { TextField } from "@/components/tailgrids/core/text-field";

export default function Page() {
  const [isloading, setLoading] = useState<boolean>(true);
  const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
  const [todo, setTodo] = useState<TodoType[]>([]);
  const [onlyWaiting,setOnlyWaiting] = useState<boolean>(false);
  const [itemsPerPage,setitemsPerPage] = useState<number>(5);
  const [totalPages, settotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showDialog, setshowDialog] = useState<boolean>(false);
  
  //onload fetch todos on localStorage
  useEffect(()=>{
    const _todosRawStr = localStorage.getItem('todosRaw');
    if(_todosRawStr===null) {
      fetchTodos()
      .then((data) => setTodosRaw(data as TodoType[]))
      .catch((error) => setTodosRaw([]))
      .finally(() => setLoading(false));
    }
    else {
      setTodosRaw(JSON.parse(_todosRawStr) as TodoType[]);
      setLoading(false);
    }
  },[])

  useEffect(()=>{
    localStorage.setItem('todosRaw',JSON.stringify(todosRaw));
  },[todosRaw])

  //onload fetch todos dummy data
  // useEffect(() => {
  //   fetchTodos()
  //     .then((data) => setTodosRaw(data as TodoType[]))
  //     .catch((error) => setTodosRaw([]))
  //     .finally(() => setLoading(false));
  // }, []);

  // todoRaw, onlyWaiting => [] => todos
  useEffect(() => {
    //console.log("Todos Row updated:", todosRow);

    // bypass to todos (fix later)
    onlyWaiting ? setTodo(todosRaw.filter((todos)=>todos.completed === false)) : setTodo(todosRaw);
  }, [todosRaw , onlyWaiting]);

  // itemsPerPage => [] => totalPages
  useEffect(()=>{
    settotalPage(Math.ceil(todo.length/itemsPerPage));
  },[todo,itemsPerPage])

  useEffect(()=>{
    if(totalPages)
      if(currentPage<=0) setCurrentPage(1);
      else if(currentPage>totalPages) setCurrentPage(totalPages);
  },[totalPages])

  // Delete
  const deleteTodo = (id:number) =>{
    // console.log('delete....(${id})');
    setTodosRaw(todosRaw.filter((todo)=> todo.id !== id));
  } 

  // Make Done
  const makeDone = (id:number) =>{
    // console.log('Make Done....(${id})');
    
    // Pointer Selected
    const selected = todosRaw.find((todo)=> todo.id === id);
    // edit (Not updata)
    selected!.completed = true

    // updata state
    setTodosRaw([...todosRaw]);
  } 
  // Add new Todo
  const addTodo = () =>{
    // console.log('add todo....(${id})');
    const idDom = document.getElementById('id') as HTMLInputElement;
    const titleDom = document.getElementById('title') as HTMLInputElement;
    
    const titleStr = titleDom.value.trim();
    if(titleStr ==="") return 
    
    const newTodo:TodoType = {
      userId: 1,
      id: Number(idDom.value),
      title: titleDom.value.trim(),
      completed: false
    }  
    setTodosRaw([...todosRaw,newTodo])
  } 

  return (
    <>
    <div className="mt-4 mb-4 w-[800px] mx-auto">
      {/* control */}
      <div className="flex justify-between gap-4">
        <div className="flex justify-end gap-2">
        <Toggle 
        label="Show only waiting" 
        checked={onlyWaiting} 
        onChange={(e)=>setOnlyWaiting(e.target.checked)}
        />

        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white pointer-events-none">
          Waiting <ClockThree />
        </Button>
        </div>
        <div className="w-2/5">
          <NativeSelect value={itemsPerPage} onChange={(e)=>setitemsPerPage(Number(e.target.value))}>
            <NativeSelectOption value="5">5 items per page</NativeSelectOption>
            <NativeSelectOption value="10">10 items per page</NativeSelectOption>
            <NativeSelectOption value="50">50 items per page</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* table */}
      <div className="mt-2">
        <TableRoot fullBleed>
          <TableHeader>
            <TableRow className="bg-black [&>th]:text-title-50 [&>th]:text-white [&>th]:font-semibold">
              <TableHead className="w-24 font-bold text-right" scope="col">
                ID
              </TableHead>
              <TableHead className="font-bold text-center" scope="col">
                Title
              </TableHead>
              <TableHead
                className="font-bold flex justify-end items-center gap-2"
                scope="col"
              >
                Completed
                <Button 
                variant="primary"
                onClick={()=>setshowDialog(true)}
                >
                  <Plus />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Showing loading state */}
            {isloading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            )}

            {!isloading && todo.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500">
                  No data, may be connection refused (refetch again)
                </TableCell>
              </TableRow>
            )}

            {/* render data */}
            {todo
            .filter((todo,index)=>{
              const lower = (currentPage-1)*(itemsPerPage);
              const upper = (currentPage)*(itemsPerPage-1);
              return index >= lower && index <= upper
            })
            .map((todo) => {
              return (
                <TableRow key={todo.id}>
                  <TableCell className="text-right">
                    <Badge
                      size="lg"
                      className="bg-gray-500 text-white font-bold rounded-xl"
                    >
                      {todo.id}
                    </Badge>
                  </TableCell>

                  <TableCell>{todo.title}</TableCell>

                  <TableCell className="font-bold flex justify-end items-center gap-2">
                    {todo.completed ? (
                      <Button
                        variant="success"
                        className=" pointer-events-none"
                      >
                        Done <Check />
                      </Button>
                    ) : (
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={()=>makeDone(todo.id)}
                      >
                        Waiting <ClockThree />
                      </Button>
                    )}
                    <Button variant="danger"
                    onClick={()=>deleteTodo(todo.id)}
                    >
                      <Trash1 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* completed = false */}
            {/* <TableRow>
              <TableCell className="text-right">
                <Badge 
                size="lg"
                className="bg-gray-500 text-white font-bold rounded-xl"
                >
                  10313
                </Badge>
              </TableCell>

              <TableCell>
                Lorem ipsum dolor.
              </TableCell>

              <TableCell className="font-bold flex justify-end items-center gap-2">
                <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Waiting <ClockThree />
                </Button>
                <Button variant="danger">
                  <Trash1 />
                </Button>
              </TableCell>

            </TableRow> */}

            {/* const completed = true */}
            {/* <TableRow>
              <TableCell className="text-right">
                <Badge 
                size="lg"
                className="bg-gray-500 text-white font-bold rounded-xl"
                >
                  1314414
                </Badge>
              </TableCell>

              <TableCell> 
                Lorem ipsum dolor.
              </TableCell>

              <TableCell className="font-bold flex justify-end items-center gap-2">
                <Button variant="success" className=" pointer-events-none">
                  Done <Check />
                </Button>
                <Button variant="danger">
                  <Trash1 />
                </Button>
              </TableCell>
    
            </TableRow> */}

          </TableBody>
        </TableRoot>
      </div>

      {/* pagination */}
      {todo.length > 0 && (
        <div className="mt-1 w-1/3 mx-auto flex justify-center items-center gap-1">
          <Button 
          size="sm" 
          appearance="outline" 
          onClick={()=>setCurrentPage(1)}
          disabled={currentPage===1}
          >
            First
          </Button>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              sideLayout="icon"
            />
          </div>
          <Button 
          size="sm" 
          appearance="outline" 
          onClick={()=>setCurrentPage(totalPages)}
          disabled={currentPage===totalPages}
          >
            Last
          </Button>
        </div>
      )}
    </div>
    <Backdrop isOpen={showDialog} onOpenChange={setshowDialog}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="bg-blue-100 rounded-md" size={32}/> Add Todo
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form className="flex flex-col gap-4">
              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">ID (auto)</Label>
                <Input
                  className="w-full pointer-events-none bg-gray-100"
                  id="id"
                  value={todosRaw.reduce((p,t) => t.id > p ? t.id : p,0)+1}
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">Title</Label>
                <Input
                  type="text"
                  placeholder="ใส่งานที่ต้องการเพิ่ม"
                  className="w-full"
                  id="title"
                  autoFocus
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={()=>addTodo()}>Add Todo</DialogClose>
          </DialogFooter>
        </Dialog>
      </Backdrop>
      </>
  );
}