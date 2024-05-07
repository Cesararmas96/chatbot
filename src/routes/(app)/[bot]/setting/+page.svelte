<script>
  import SidebarBot from "$lib/components/SidebarBot.svelte";
  import { Input, Label, Select, Radio, Range } from "flowbite-svelte";
  let minmaxValue = 5;
</script>

<div class="flex h-screen antialiased text-gray-800">
  <div class="flex flex-row h-full w-full overflow-x-hidden">
    <SidebarBot />

    <div class="flex flex-col flex-auto h-full p-6">
      <div class="flex flex-col flex-auto flex-shrink-0 bg-white h-full p-4">
        <h2>Setting</h2>

        <form action="">
          Chatbot
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            
            <div>
              <Label>Name</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Company</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Company Website</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Contact Information</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Contact Form</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Role</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Purpose</Label>
              <Input type="text"></Input>
            </div>
          </div>

          Models
          <div class="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <Label>
                  LLM
                  <Select />
                </Label>
              </div>

              <div>
                <Label>
                  Model Name
                  <Select />
                </Label>
              </div>

              <div>
                <Label>
                  Embedding
                  <Select />
                </Label>
              </div>

              <div>
                <Label>
                  Tokenizer
                  <Select />
                </Label>
              </div>

              <div class="flex gap-3">
                <Label>Use Bge</Label>
                <Radio>True</Radio>
                <Radio>False</Radio>
              </div>

              <div>
                <Label>
                  Classification
                  <Select />
                </Label>
              </div>

              <div>
                <Label>
                  Summarization
                  <Select />
                </Label>
              </div>

              <div>
                <Label>
                  Rag_model
                  <Select />
                </Label>
              </div>
          </div>

          LLM Config
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div class="flex gap-3">
              <Label>Use Barden</Label>
              <Radio>True</Radio>
              <Radio>False</Radio>
            </div>

            <div>
              <Label>Max Token</Label>
              <Range  min="0" max="10" bind:value={minmaxValue} />
              <p>Value: {minmaxValue}</p>
            </div>
            <div>
              <Label>Top K</Label>
              <Range  min="0" max="10" bind:value={minmaxValue} />
              <p>Value: {minmaxValue}</p>
            </div>
            
            <div>
              <Label>Top P</Label>
              <Range  min="0" max="10" bind:value={minmaxValue} />
              <p>Value: {minmaxValue}</p>
            </div>


          
          </div>
          
          Vector Database
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label>Collection</Label>
              <Input type="text"></Input>
            </div>
            <div>
              <Label>Vector Database</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Database</Label>
              <Input type="text"></Input>
            </div>

            <div>
              <Label>Chunk Size</Label>
              <Input type="text"></Input>
            </div>
          </div>

          Pre Instructions
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label>Instruction</Label>
              <Input type="text"></Input>
            </div>
          </div>

          Knowledge Base
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label>Data</Label>
              <Input type="text"></Input>
            </div>
          </div>



        </form>
      </div>
    </div>
  </div>
</div>
