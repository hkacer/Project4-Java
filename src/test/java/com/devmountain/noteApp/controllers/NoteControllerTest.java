package com.devmountain.noteApp.controllers;

import static org.junit.jupiter.api.Assertions.*;

import com.devmountain.noteApp.dtos.NoteDto;
import com.devmountain.noteApp.services.NoteService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(MockitoJUnitRunner.class)
public class NoteControllerTest {
    private MockMvc mockMvc;

    @Mock
    private NoteService noteService;

    @InjectMocks
    private NoteController noteController;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(noteController).build();
    }

    @Test
    public void getNotesByUser_ShouldReturnNotesList() throws Exception {
        List<NoteDto> notes = Arrays.asList(
                new NoteDto(1L, "Note 1", "Description 1"),
                new NoteDto(2L, "Note 2", "Description 2")
        );

        given(noteService.getAllNotesByUserId(1L)).willReturn(notes);

        mockMvc.perform(get("/api/v1/notes/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Note 1")))
                .andExpect(jsonPath("$[0].description", is("Description 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Note 2")))
                .andExpect(jsonPath("$[1].description", is("Description 2")));

        verify(noteService).getAllNotesByUserId(1L);
    }

    @Test
    public void getNoteById_ShouldReturnNote() throws Exception {
        NoteDto note = new NoteDto(1L, "Note 1", "Description 1");

        given(noteService.getNoteById(1L)).willReturn(Optional.of(note));

        mockMvc.perform(get("/api/v1/notes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Note 1")))
                .andExpect(jsonPath("$.description", is("Description 1")));

        verify(noteService).getNoteById(1L);
    }

    @Test
    public void getNoteById_ShouldReturnNotFound() throws Exception {
        given(noteService.getNoteById(1L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/notes/1"))
                .andExpect(status().isNotFound());

        verify(noteService).getNoteById(1L);
    }

    @Test
    public void addNote_ShouldAddNote() throws Exception {
        NoteDto note = new NoteDto(1L, "Note 1", "Description 1");

        doNothing().when(noteService).addNote(note, 1L);

        mockMvc.perform(post("/api/v1/notes/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Note 1\",\"description\":\"Description 1\"}"))
                .andExpect(status().isCreated());

        verify(noteService).addNote(note, 1L);
    }

    @Test
    public void deleteNoteById_ShouldDeleteNote() throws Exception {
        doNothing().when(noteService).deleteNoteById(1L);

        mockMvc.perform(delete("/api/v1/notes/1"))
                .andExpect(status().isNoContent());

        verify(noteService).deleteNoteById(1L);
    }

    @Test
    public void updateNote_ShouldUpdateNote() throws Exception {
        NoteDto note = new NoteDto(1L, "Note 1", "Description 1");

        doNothing().when(noteService).updateNoteById(note);

        mockMvc.perform(put("/api/v1/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"title\":\"Note 1\",\"description\":\"Description 1\"}"))
                .andExpect(status().isNoContent());

        verify(noteService).updateNoteById(note);
    }
}

